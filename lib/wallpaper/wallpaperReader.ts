import { fs } from "../FileSystem";
import { BUILTIN_WALLPAPERS, DESKTOP_PICTURES_DIR } from "./constants";
import { WallpaperInfo } from "./types";

export async function readWallpaperDataUrl(path: string): Promise<string> {
  if (path.startsWith("/assets/") || path.startsWith("blob:") || path.startsWith("data:") || path.startsWith("http")) {
    return path;
  }
  try {
    const fileName = path.split("/").pop()!;
    const exists = await fs.exists(`${DESKTOP_PICTURES_DIR}/${fileName}`);
    if (!exists) return path;

    const blob = await fs.readBlob(DESKTOP_PICTURES_DIR, fileName);
    if (!blob) return path;
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("[Wallpaper] Failed to read from OPFS:", error);
    return path;
  }
}

export async function readCustomWallpapersFromOPFS(): Promise<WallpaperInfo[]> {
  try {
    if (!(await fs.exists(DESKTOP_PICTURES_DIR))) return [];
    const files = await fs.ls(DESKTOP_PICTURES_DIR);

    const isBuiltIn = (fileName: string) =>
      BUILTIN_WALLPAPERS.some((w) =>
        Object.values(w.variants).some((p) => p?.endsWith(fileName))
      );

    const customMap = new Map<string, WallpaperInfo>();

    for (const file of files) {
      if (file.kind !== "file" || isBuiltIn(file.name)) continue;
      const withoutExt = file.name.replace(/\.[^/.]+$/, "");
      let baseName = withoutExt;
      let variant = "standard";

      if (withoutExt.endsWith("-light")) {
        baseName = withoutExt.replace("-light", "");
        variant = "light";
      } else if (withoutExt.endsWith("-dark")) {
        baseName = withoutExt.replace("-dark", "");
        variant = "dark";
      } else if (withoutExt.endsWith("-morning")) {
        baseName = withoutExt.replace("-morning", "");
        variant = "morning";
      }

      if (!customMap.has(baseName)) {
        customMap.set(baseName, {
          name: baseName,
          baseName,
          variants: { standard: "" },
          isCustom: true,
        });
      }

      const info = customMap.get(baseName)!;
      const url = await readWallpaperDataUrl(`${DESKTOP_PICTURES_DIR}/${file.name}`);
      if (variant === "standard") info.variants.standard = url;
      else if (variant === "light") info.variants.light = url;
      else if (variant === "dark") info.variants.dark = url;
      else if (variant === "morning") info.variants.morning = url;
    }

    const list: WallpaperInfo[] = [];
    for (const wp of customMap.values()) {
      if (!wp.variants.standard) {
        wp.variants.standard = wp.variants.light || wp.variants.dark || wp.variants.morning || "";
      }
      list.push(wp);
    }
    return list;
  } catch (e) {
    console.error("Failed to load custom wallpapers from OPFS", e);
    return [];
  }
}

export async function saveCustomWallpaperToOPFS(file: File | Blob, name: string): Promise<string> {
  if (!(await fs.exists(DESKTOP_PICTURES_DIR))) {
    await fs.mkdir(DESKTOP_PICTURES_DIR);
  }
  await fs.writeBlob(DESKTOP_PICTURES_DIR, name, file);
  return readWallpaperDataUrl(`${DESKTOP_PICTURES_DIR}/${name}`);
}
