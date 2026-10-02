import { fs } from "./FileSystem";
import { BUILTIN_WALLPAPERS, DESKTOP_PICTURES_DIR } from "./wallpaper/constants";
import {
  readCustomWallpapersFromOPFS,
  readWallpaperDataUrl,
  saveCustomWallpaperToOPFS,
} from "./wallpaper/wallpaperReader";
import { WallpaperInfo } from "./wallpaper/types";

export type { WallpaperInfo, WallpaperVariants } from "./wallpaper/types";

export class WallpaperManager {
  private static cache: WallpaperInfo[] | null = null;

  static async initializeWallpapers(): Promise<void> {
    const exists = await fs.exists(DESKTOP_PICTURES_DIR);
    if (!exists) {
      await fs.mkdir(DESKTOP_PICTURES_DIR);
    }
  }

  static async getWallpapersFromOPFS(forceRefresh = false): Promise<WallpaperInfo[]> {
    if (this.cache && !forceRefresh) {
      return this.cache;
    }
    const custom = await readCustomWallpapersFromOPFS();
    this.cache = [...BUILTIN_WALLPAPERS, ...custom];
    return this.cache;
  }

  static getAllWallpapers(): WallpaperInfo[] {
    return this.cache || BUILTIN_WALLPAPERS;
  }

  static getWallpaperPath(
    baseName: string,
    theme: "light" | "dark" | "auto"
  ): string {
    if (!baseName) return BUILTIN_WALLPAPERS[0].variants.standard;
    if (
      baseName.startsWith("data:") ||
      baseName.startsWith("blob:") ||
      baseName.startsWith("http://") ||
      baseName.startsWith("https://") ||
      (baseName.startsWith("/") && !baseName.startsWith("/assets/"))
    ) {
      return baseName;
    }

    const available = this.cache || BUILTIN_WALLPAPERS;
    const wallpaper = available.find((w) => w.baseName === baseName);

    if (!wallpaper) {
      return BUILTIN_WALLPAPERS[0].variants.standard;
    }

    if (theme === "light" && wallpaper.variants.light) {
      return wallpaper.variants.light;
    } else if (theme === "dark" && wallpaper.variants.dark) {
      return wallpaper.variants.dark;
    } else if (theme === "auto") {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 8 && wallpaper.variants.morning) {
        return wallpaper.variants.morning;
      } else if (hour >= 8 && hour < 18 && wallpaper.variants.light) {
        return wallpaper.variants.light;
      } else if (wallpaper.variants.dark) {
        return wallpaper.variants.dark;
      }
    }
    return wallpaper.variants.standard;
  }

  static getOPFSPath(publicPath: string): string {
    const fileName = publicPath.split("/").pop();
    return `${DESKTOP_PICTURES_DIR}/${fileName}`;
  }

  static async getWallpaperDataURL(path: string): Promise<string> {
    return readWallpaperDataUrl(path);
  }

  static async addCustomWallpaper(file: File | Blob, name: string): Promise<string> {
    const url = await saveCustomWallpaperToOPFS(file, name);
    await this.getWallpapersFromOPFS(true);
    return url;
  }
}
