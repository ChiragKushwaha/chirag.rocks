import { useQuery } from "@tanstack/react-query";
import { fs } from "../../lib/FileSystem";

const ICONS_DIR = "/icons";

export const useIconManager = () => {
  const { isSuccess: isReady } = useQuery({
    queryKey: ["init-icons"],
    queryFn: async () => {
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
        return true;
      } catch (e) {
        console.error("[AssetManager] Initialization failed", e);
        // Return true to unblock boot even if assets fail
        return true;
      }
    },
    staleTime: Infinity,
  });

  return { isReady };
};

export const useIcon = (iconName: string) => {
  return useAsset(`/icons/${iconName}.webp`);
};

export const useAsset = (path: string) => {
  const { data: url = null } = useQuery({
    queryKey: ["asset", path],
    enabled: !!path,
    queryFn: async () => {
      // Try OPFS
      const parts = path.split("/");
      const filename = parts.pop();
      const dir = parts.join("/") || "/";

      const blob = await fs.readBlob(dir, filename!);

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
              return URL.createObjectURL(finalBlob);
            }
          } catch (e) {
            console.error("[AssetManager] Failed to convert HEIC", e);
            return URL.createObjectURL(memoryBlob);
          }
        } else {
          return URL.createObjectURL(memoryBlob);
        }
      } else {
        // Fallback to public/assets
        // AND CACHE TO OPFS (Lazy Loading)
        let fetchUrl = path;
        // If it starts with / or http, use as is. Otherwise prepend /assets/
        if (!path.startsWith("/") && !path.startsWith("http")) {
          fetchUrl = `/assets/${path}`;
        }

        // Background cache (fire and forget logic in legacy, but here we can just do it inline or separately)
        // Since we need to return the URL immediately for display, we return the fetchUrl.
        // We can spawn the cache process separately.

        try {
          const res = await fetch(fetchUrl);
          if (res.ok) {
            // We clone logic from before: cache it.
            // But we can't wait for it if we want immediate return?
            // Actually, useQuery is async.
            // If we want immediate display if it's a remote URL, we should return the URL string.
            // But useQuery expects a promise.

            // Optimistic return: just return the URL?
            // But we want to cache it.

            const b = await res.blob();
            if (!(await fs.exists(dir))) {
              await fs.mkdir(dir);
            }
            await fs.writeBlob(dir, filename!, b);
          }
        } catch {
          // Ignore cache failures
        }

        return fetchUrl;
      }
      return null;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // Keep unused URLs in cache for 1 hour
  });

  return url;
};
