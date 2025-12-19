import { useState, useEffect } from "react";
import { fs } from "../../lib/FileSystem";

const ICONS_DIR = "/icons";

export const useIconManager = () => {
  const [isReady, setIsReady] = useState(false);

  // Initialize: Check if icons are in OPFS, if not, fetch and save them
  useEffect(() => {
    const initAssets = async () => {
      try {
        // 1. Initialize Essential Icons (Legacy / Flat structure)
        const REMOTE_ICONS: Record<string, string> = {
          finder: "/icons/finder.webp",
          trash: "/icons/trash.webp",
          trash_full: "/icons/trash_full.webp",
          launchpad: "/icons/mission_control.webp",
          folder: "/icons/folder.webp",
          photos: "/icons/photos.webp",
        };

        // Check and fetch remote icons
        await Promise.all(
          Object.entries(REMOTE_ICONS).map(async ([name, url]) => {
            const filename = `${name}.webp`;
            const exists = await fs.exists(`${ICONS_DIR}/${filename}`);
            if (!exists) {
              try {
                const res = await fetch(url);
                if (res.ok) {
                  const blob = await res.blob();
                  await fs.writeBlob(ICONS_DIR, filename, blob);
                }
              } catch (e) {
                console.error(`Failed to fetch remote icon ${name}`, e);
              }
            }
          })
        );

        // Ensure key icons exist before proceeding (fallback to manifest if absolutely needed, but we try to avoid it)
        const hasIcons = await fs.exists(`${ICONS_DIR}/finder.webp`);
        if (!hasIcons) {
          await fs.mkdir(ICONS_DIR);
          // We could fetch a minimal manifest here if needed, but the REMOTE_ICONS above covers the basics.
        }

        // 1.5 Initialize Social Assets (GIFs and PNGs)
        const SOCIAL_ASSETS = [
          "github-v2.webp",
          "twitter-x.webp",
          "linkedin.webp",
          "instagram.webp",
          "facebook.webp",
          "tiktok-v4.webp",
          "snapchat-v2.webp",
        ];

        await Promise.all(
          SOCIAL_ASSETS.map(async (filename) => {
            try {
              if (await fs.exists(`${ICONS_DIR}/${filename}`)) return;

              const res = await fetch(`/icons/${filename}`);
              if (res.ok) {
                const blob = await res.blob();
                await fs.writeBlob(ICONS_DIR, filename, blob);
              }
            } catch (e) {
              console.error(`Failed to cache asset ${filename}`, e);
            }
          })
        );

        // 2. Initialize Main System Font (SFNS.ttf) REMOVED due to size
        // The user requested to remove this large file download.
        // Falls back to system fonts sans-serif.
        console.log("[AssetManager] SFNS.ttf loading skipped (optimization)");

        console.log("[AssetManager] Optimized Assets ready");
        setIsReady(true);
      } catch (e) {
        console.error("[AssetManager] Initialization failed", e);
        // Continue even if assets fail, to not block boot
        setIsReady(true);
      }
    };

    initAssets();
  }, []);

  return { isReady };
};

export const useIcon = (iconName: string) => {
  return useAsset(`/icons/${iconName}.webp`);
};

export const useAsset = (path: string) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const load = async () => {
      if (!path) return;

      // Try OPFS
      const parts = path.split("/");
      const filename = parts.pop();
      const dir = parts.join("/") || "/";

      const blob = await fs.readBlob(dir, filename!);

      if (!active) return;

      if (blob) {
        const arrayBuffer = await blob.arrayBuffer();
        const memoryBlob = new Blob([arrayBuffer], { type: blob.type });

        if (filename?.toLowerCase().endsWith(".heic")) {
          try {
            interface WindowWithHeic extends Window {
              heic2any?: (options: {
                blob: Blob;
                toType: string;
                quality: number;
              }) => Promise<Blob | Blob[]>;
            }
            const win = window as unknown as WindowWithHeic;

            if (!win.heic2any) {
              await new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "/lib/heic2any.min.js";
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
              });
            }

            if (win.heic2any) {
              const convertedBlob = await win.heic2any({
                blob: memoryBlob,
                toType: "image/jpeg",
                quality: 0.9,
              });

              const finalBlob = Array.isArray(convertedBlob)
                ? convertedBlob[0]
                : convertedBlob;
              objectUrl = URL.createObjectURL(finalBlob);
              setUrl(objectUrl);
            }
          } catch (e) {
            console.error("[AssetManager] Failed to convert HEIC", e);
            objectUrl = URL.createObjectURL(memoryBlob);
            setUrl(objectUrl);
          }
        } else {
          objectUrl = URL.createObjectURL(memoryBlob);
          setUrl(objectUrl);
        }
      } else {
        // Fallback to public/assets
        // AND CACHE TO OPFS (Lazy Loading)
        let fetchUrl = path;
        // If it starts with / or http, use as is. Otherwise prepend /assets/
        if (!path.startsWith("/") && !path.startsWith("http")) {
          fetchUrl = `/assets/${path}`;
        }

        // Just set URL to fetchUrl for immediate display
        setUrl(fetchUrl);

        // Background cache
        (async () => {
          try {
            const res = await fetch(fetchUrl);
            if (res.ok) {
              const b = await res.blob();
              if (!(await fs.exists(dir))) {
                await fs.mkdir(dir);
              }
              await fs.writeBlob(dir, filename!, b);
              // console.log(`[AssetManager] Lazy cached ${filename}`);
            }
          } catch {
            // Ignore cache failures
          }
        })();
      }
    };

    load();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [path]);

  return url;
};
