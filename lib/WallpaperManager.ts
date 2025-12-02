import { fs } from "./FileSystem";

export interface WallpaperInfo {
  name: string;
  baseName: string;
  variants: {
    standard: string;
    light?: string;
    dark?: string;
    morning?: string;
  };
}

const WALLPAPERS: WallpaperInfo[] = [
  {
    name: "WhiteSur",
    baseName: "WhiteSur",
    variants: {
      standard: "/assets/System/Library/Desktop Pictures/WhiteSur.webp",
      light: "/assets/System/Library/Desktop Pictures/WhiteSur-light.webp",
      dark: "/assets/System/Library/Desktop Pictures/WhiteSur-dark.webp",
      morning: "/assets/System/Library/Desktop Pictures/WhiteSur-morning.webp",
    },
  },
  {
    name: "Monterey",
    baseName: "Monterey",
    variants: {
      standard: "/assets/System/Library/Desktop Pictures/Monterey.webp",
      light: "/assets/System/Library/Desktop Pictures/Monterey-light.webp",
      dark: "/assets/System/Library/Desktop Pictures/Monterey-dark.webp",
      morning: "/assets/System/Library/Desktop Pictures/Monterey-morning.webp",
    },
  },
];

export class WallpaperManager {
  /**
   * Initialize wallpapers by copying them to OPFS
   */
  static async initializeWallpapers(): Promise<void> {
    const desktopPicturesPath = "/System/Library/Desktop Pictures";

    // Ensure directory exists
    const exists = await fs.exists(desktopPicturesPath);
    if (!exists) {
      await fs.mkdir("/System/Library/Desktop Pictures");
    }

    // Copy each wallpaper to OPFS
    for (const wallpaper of WALLPAPERS) {
      const variantEntries = Object.entries(wallpaper.variants);
      for (let i = 0; i < variantEntries.length; i++) {
        const [, publicPath] = variantEntries[i];
        if (publicPath) {
          try {
            const fileName = publicPath.split("/").pop()!;
            const opfsPath = `${desktopPicturesPath}/${fileName}`;

            // Check if already exists
            const fileExists = await fs.exists(opfsPath);
            if (!fileExists) {
              // Fetch from public folder and write to OPFS
              const response = await fetch(publicPath);
              const blob = await response.blob();
              const arrayBuffer = await blob.arrayBuffer();
              const uint8Array = new Uint8Array(arrayBuffer);

              await fs.writeFile(
                desktopPicturesPath,
                fileName,
                new TextDecoder().decode(uint8Array)
              );

              console.log(`[Wallpaper] Copied ${fileName} to OPFS`);
            } else {
              console.log(`[Wallpaper] ${fileName} already exists in OPFS`);
            }
          } catch (error) {
            console.error(`[Wallpaper] Failed to copy ${publicPath}:`, error);
          }
        }
      }
    }
  }

  /**
   * Get all available wallpapers from OPFS
   */
  static async getWallpapersFromOPFS(): Promise<WallpaperInfo[]> {
    const desktopPicturesPath = "/System/Library/Desktop Pictures";
    try {
      if (!(await fs.exists(desktopPicturesPath))) {
        return WALLPAPERS;
      }

      const files = await fs.ls(desktopPicturesPath);
      const wallpaperMap = new Map<string, WallpaperInfo>();

      // Helper to get OPFS URL
      const getUrl = (filename: string) =>
        `/System/Library/Desktop Pictures/${filename}`;

      for (const file of files) {
        if (file.kind !== "file") continue;

        // Parse filename: Name-variant.ext or Name.ext
        // e.g. Monterey-light.webp -> Base: Monterey, Variant: light
        // e.g. Monterey.webp -> Base: Monterey, Variant: standard

        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        let baseName = fileNameWithoutExt;
        let variant = "standard";

        if (fileNameWithoutExt.endsWith("-light")) {
          baseName = fileNameWithoutExt.replace("-light", "");
          variant = "light";
        } else if (fileNameWithoutExt.endsWith("-dark")) {
          baseName = fileNameWithoutExt.replace("-dark", "");
          variant = "dark";
        } else if (fileNameWithoutExt.endsWith("-morning")) {
          baseName = fileNameWithoutExt.replace("-morning", "");
          variant = "morning";
        }

        if (!wallpaperMap.has(baseName)) {
          wallpaperMap.set(baseName, {
            name: baseName,
            baseName: baseName,
            variants: { standard: "" }, // Will be filled
          });
        }

        const info = wallpaperMap.get(baseName)!;
        const url = await this.getWallpaperDataURL(getUrl(file.name));

        if (variant === "standard") info.variants.standard = url;
        else if (variant === "light") info.variants.light = url;
        else if (variant === "dark") info.variants.dark = url;
        else if (variant === "morning") info.variants.morning = url;
      }

      // Ensure every wallpaper has a standard variant (fallback to any available)
      for (const wp of wallpaperMap.values()) {
        if (!wp.variants.standard) {
          wp.variants.standard =
            wp.variants.light || wp.variants.dark || wp.variants.morning || "";
        }
      }

      return Array.from(wallpaperMap.values());
    } catch (e) {
      console.error("Failed to load wallpapers from OPFS", e);
      return WALLPAPERS;
    }
  }

  /**
   * Get all available wallpapers (Static fallback)
   */
  static getAllWallpapers(): WallpaperInfo[] {
    return WALLPAPERS;
  }

  /**
   * Get the appropriate wallpaper path based on theme
   */
  static getWallpaperPath(
    baseName: string,
    theme: "light" | "dark" | "auto"
  ): string {
    const wallpaper = WALLPAPERS.find((w) => w.baseName === baseName);
    if (!wallpaper) {
      // Fallback to first wallpaper
      return WALLPAPERS[0].variants.standard;
    }

    // Select variant based on theme
    if (theme === "light" && wallpaper.variants.light) {
      return wallpaper.variants.light;
    } else if (theme === "dark" && wallpaper.variants.dark) {
      return wallpaper.variants.dark;
    } else if (theme === "auto") {
      // Use time-based selection for auto mode
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 8 && wallpaper.variants.morning) {
        return wallpaper.variants.morning;
      } else if (hour >= 8 && hour < 18 && wallpaper.variants.light) {
        return wallpaper.variants.light;
      } else if (wallpaper.variants.dark) {
        return wallpaper.variants.dark;
      }
    }

    // Fallback to standard variant
    return wallpaper.variants.standard;
  }

  /**
   * Get OPFS path for a wallpaper
   */
  static getOPFSPath(publicPath: string): string {
    const fileName = publicPath.split("/").pop();
    return `/System/Library/Desktop Pictures/${fileName}`;
  }

  /**
   * Read wallpaper from OPFS as data URL
   */
  static async getWallpaperDataURL(publicPath: string): Promise<string> {
    try {
      const fileName = publicPath.split("/").pop()!;
      const desktopPicturesPath = "/System/Library/Desktop Pictures";

      console.log(`[Wallpaper] Reading ${fileName} from OPFS...`);
      const content = await fs.readFile(desktopPicturesPath, fileName);

      // Convert to data URL (for webp images)
      const blob = new Blob([content], { type: "image/webp" });
      const url = URL.createObjectURL(blob);
      console.log(`[Wallpaper] Successfully read ${fileName} from OPFS`);
      return url;
    } catch (error) {
      console.error("[Wallpaper] Failed to read from OPFS:", error);
      // Fallback to public path
      return publicPath;
    }
  }
}
