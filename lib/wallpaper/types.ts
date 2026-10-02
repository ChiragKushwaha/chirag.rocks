export interface WallpaperVariants {
  standard: string;
  light?: string;
  dark?: string;
  morning?: string;
}

export interface WallpaperInfo {
  name: string;
  baseName: string;
  variants: WallpaperVariants;
  isCustom?: boolean;
}
