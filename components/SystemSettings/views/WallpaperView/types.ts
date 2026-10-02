import { WallpaperInfo } from "../../../../lib/WallpaperManager";

export type Wallpaper = WallpaperInfo;

export interface WallpaperHeaderProps {
  title: string;
  description: string;
}

export interface WallpaperCurrentPreviewProps {
  currentWallpaperName: string;
  currentVariant?: string;
  showOnAllSpacesLabel: string;
}

export interface WallpaperGridProps {
  title: string;
  wallpapers: Wallpaper[];
  currentWallpaperName: string;
  isDark: boolean;
  onSelect: (baseName: string) => void;
}

export interface WallpaperCustomPhotosProps {
  title: string;
  addPhotoLabel: string;
  customWallpapers: Wallpaper[];
  currentWallpaperName: string;
  onSelect: (baseName: string) => void;
  onAddPhoto: (file: File) => Promise<void>;
}
