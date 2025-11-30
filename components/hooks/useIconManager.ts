import { useState, useEffect } from "react";
import { fs } from "../../lib/FileSystem";

const ICONS_DIR = "/System/Icons";
const ASSETS_ROOT = ""; // Root for full paths

export const useIconManager = () => {
  const [isReady, setIsReady] = useState(false);

  // Initialize: Check if icons are in OPFS, if not, fetch and save them
  useEffect(() => {
    const initAssets = async () => {
      try {
        // 1. Initialize Icons (Legacy / Flat structure)
        const hasIcons = await fs.exists(`${ICONS_DIR}/finder.png`);

        if (!hasIcons) {
          console.log("[AssetManager] Initializing icons in OPFS...");
          await fs.mkdir(ICONS_DIR);

          const response = await fetch("/icons/manifest.json");
          if (response.ok) {
            const manifest = await response.json();
            await Promise.all(
              manifest.map(async (filename: string) => {
                try {
                  const res = await fetch(`/icons/${filename}`);
                  const blob = await res.blob();
                  await fs.writeBlob(ICONS_DIR, filename, blob);
                } catch (e) {
                  console.error(`Failed to cache icon ${filename}`, e);
                }
              })
            );
          }
        }

        // 2. Initialize System Assets (Recursive structure)
        // Check for a known asset
        const hasAssets = await fs.exists("/System/Library/Fonts/SFNS.ttf");

        if (!hasAssets) {
          console.log("[AssetManager] Initializing system assets in OPFS...");
          const response = await fetch("/assets/manifest.json");
          if (response.ok) {
            const manifest = await response.json(); // Array of paths like "/System/Library/..."

            // Process sequentially or in chunks to avoid overwhelming network/fs
            for (const path of manifest) {
              try {
                // path is like "/System/Library/..."
                // Fetch from public/assets/System/Library...
                const fetchUrl = `/assets${path}`;
                const res = await fetch(fetchUrl);
                if (!res.ok) continue;

                const blob = await res.blob();

                // Write to OPFS at exact path
                // We need to split path to get dir and filename
                const parts = path.split("/");
                const filename = parts.pop();
                const dir = parts.join("/") || "/";

                await fs.writeBlob(dir, filename!, blob);
              } catch (e) {
                console.error(`Failed to cache asset ${path}`, e);
              }
            }
          }
        }

        // 3. Load System Fonts from OPFS
        try {
          const fontBlob = await fs.readBlob(
            "/System/Library/Fonts",
            "SFNS.ttf"
          );
          if (fontBlob) {
            const fontData = await fontBlob.arrayBuffer();
            const font = new FontFace("SF Pro Text", fontData);
            await font.load();
            document.fonts.add(font);
            document.body.style.fontFamily =
              '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif';
            console.log("[AssetManager] SF Pro Text loaded from OPFS");
          }
        } catch (e) {
          console.error("[AssetManager] Failed to load system font", e);
        }

        console.log("[AssetManager] Assets ready");
        setIsReady(true);
      } catch (e) {
        console.error("[AssetManager] Initialization failed", e);
        setIsReady(true);
      }
    };

    initAssets();
  }, []);

  return { isReady };
};

export const useIcon = (iconName: string) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const loadIcon = async () => {
      if (!iconName) return;

      // Try OPFS first
      const filename = `${iconName}.png`;
      const blob = await fs.readBlob(ICONS_DIR, filename);

      if (!active) return;

      if (blob) {
        objectUrl = URL.createObjectURL(blob);
        setIconUrl(objectUrl);
      } else {
        // Fallback to public folder if not in OPFS
        // To avoid 404s for known missing icons, we could check a list,
        // but for now we'll just let it try.
        setIconUrl(`/icons/${filename}`);
      }
    };

    loadIcon();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [iconName]);

  return iconUrl;
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
        if (filename?.toLowerCase().endsWith(".heic")) {
          try {
            // Load heic2any from public/lib if not already loaded
            if (!(window as any).heic2any) {
              await new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "/lib/heic2any.min.js";
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
              });
            }

            const heic2any = (window as any).heic2any;
            const convertedBlob = await heic2any({
              blob,
              toType: "image/jpeg",
              quality: 0.9,
            });

            // heic2any can return Blob or Blob[]
            const finalBlob = Array.isArray(convertedBlob)
              ? convertedBlob[0]
              : convertedBlob;
            objectUrl = URL.createObjectURL(finalBlob);
            setUrl(objectUrl);
          } catch (e) {
            console.error("[AssetManager] Failed to convert HEIC", e);
            // Fallback to original blob
            objectUrl = URL.createObjectURL(blob);
            setUrl(objectUrl);
          }
        } else {
          objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
        }
      } else {
        // Fallback to public/assets
        setUrl(`/assets${path}`);
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
