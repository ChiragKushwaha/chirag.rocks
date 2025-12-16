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
  private static cache: WallpaperInfo[] | null = null;

  /**
   * Initialize wallpapers - ensure directory exists but DON'T copy files eagerly
   */
  static async initializeWallpapers(): Promise<void> {
    const desktopPicturesPath = "/System/Library/Desktop Pictures";

    // Ensure directory exists
    const exists = await fs.exists(desktopPicturesPath);
    if (!exists) {
      await fs.mkdir("/System/Library/Desktop Pictures");
    }

    console.log("✅ Desktop Pictures directory ready (lazy loading enabled)");
  }

  /**
   * Get all available wallpapers (Static + OPFS)
   */
  static async getWallpapersFromOPFS(
    forceRefresh = false
  ): Promise<WallpaperInfo[]> {
    if (this.cache && !forceRefresh) {
      return this.cache;
    }

    const desktopPicturesPath = "/System/Library/Desktop Pictures";
    const allWallpapers = [...WALLPAPERS]; // Start with built-ins

    try {
      if (!(await fs.exists(desktopPicturesPath))) {
        return allWallpapers;
      }

      const files = await fs.ls(desktopPicturesPath);

      // Helper to check if a file is a built-in variant
      const isBuiltIn = (fileName: string) => {
        return WALLPAPERS.some((w) =>
          Object.values(w.variants).some((path) => path?.endsWith(fileName))
        );
      };

      const customWallpaperMap = new Map<string, WallpaperInfo>();

      // Helper to get OPFS URL
      const getUrl = (filename: string) =>
        `/System/Library/Desktop Pictures/${filename}`;

      for (const file of files) {
        if (file.kind !== "file") continue;

        // Skip files that match built-in filenames to avoid duplicates if they were somehow copied
        if (isBuiltIn(file.name)) continue;

        // Parse filename: Name-variant.ext or Name.ext
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

        if (!customWallpaperMap.has(baseName)) {
          customWallpaperMap.set(baseName, {
            name: baseName,
            baseName: baseName,
            variants: { standard: "" }, // Will be filled
          });
        }

        const info = customWallpaperMap.get(baseName)!;
        const url = await this.getWallpaperDataURL(getUrl(file.name));

        if (variant === "standard") info.variants.standard = url;
        else if (variant === "light") info.variants.light = url;
        else if (variant === "dark") info.variants.dark = url;
        else if (variant === "morning") info.variants.morning = url;
      }

      // Ensure every custom wallpaper has a standard variant
      for (const wp of customWallpaperMap.values()) {
        if (!wp.variants.standard) {
          wp.variants.standard =
            wp.variants.light || wp.variants.dark || wp.variants.morning || "";
        }
        allWallpapers.push(wp);
      }

      this.cache = allWallpapers;
      return allWallpapers;
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
    // Check cache first if available, otherwise static list (could be custom wallpaper)
    const available = this.cache || WALLPAPERS;
    const wallpaper = available.find((w) => w.baseName === baseName);

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
   * Read wallpaper data URL
   * If it's an OPFS path, read it. If it's public, return as is.
   */
  static async getWallpaperDataURL(path: string): Promise<string> {
    if (path.startsWith("/assets/")) {
      return path;
    }

    try {
      const fileName = path.split("/").pop()!;
      const desktopPicturesPath = "/System/Library/Desktop Pictures";

      // Check if it exists in OPFS first (if passed absolute path like /System/Library...)
      // But path here often comes from getUrl which constructs /System/Library...

      const exists = await fs.exists(`${desktopPicturesPath}/${fileName}`);
      if (!exists) {
        // If path looks like a public asset but was passed as a filename?
        // No, the caller logic handles that.
        // If we are here, it's expected to be in OPFS.
        return path;
      }

      // console.log(`[Wallpaper] Reading ${fileName} from OPFS...`);
      const blob = await fs.readBlob(desktopPicturesPath, fileName);

      if (!blob) {
        throw new Error("File not found or empty");
      }

      // Create Object URL from Blob
      const url = URL.createObjectURL(blob);
      // console.log(`[Wallpaper] Successfully read ${fileName} from OPFS`);
      return url;
    } catch (error) {
      console.error("[Wallpaper] Failed to read from OPFS:", error);
      // Fallback to return path itself? or fail?
      // existing logic returned publicPath on error, but here path IS the path.
      return path;
    }
  }
}
