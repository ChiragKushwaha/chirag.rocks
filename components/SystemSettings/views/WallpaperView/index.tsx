import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSystemStore } from "../../../../store/systemStore";
import { WallpaperManager } from "../../../../lib/WallpaperManager";
import { WallpaperHeader } from "./WallpaperHeader";
import { WallpaperCurrentPreview } from "./WallpaperCurrentPreview";
import { WallpaperGrid } from "./WallpaperGrid";
import { WallpaperCustomPhotos } from "./WallpaperCustomPhotos";

export const WallpaperView: React.FC = () => {
  const { wallpaperName, setWallpaperName, isDark } = useSystemStore();
  const t = useTranslations("SystemSettings.Wallpaper");
  const queryClient = useQueryClient();

  const { data: wallpapers = WallpaperManager.getAllWallpapers() } = useQuery({
    queryKey: ["wallpapers-list"],
    queryFn: () => WallpaperManager.getWallpapersFromOPFS(),
    staleTime: 5000,
  });

  const builtinWallpapers = wallpapers.filter((w) => !w.isCustom);
  const customWallpapers = wallpapers.filter((w) => w.isCustom);

  const currentWallpaper =
    wallpapers.find((w) => w.baseName === wallpaperName) ||
    builtinWallpapers[0];

  const currentVariant =
    wallpaperName.startsWith("data:") ||
    wallpaperName.startsWith("blob:") ||
    wallpaperName.startsWith("http")
      ? wallpaperName
      : isDark
      ? currentWallpaper?.variants.dark || currentWallpaper?.variants.standard
      : currentWallpaper?.variants.light || currentWallpaper?.variants.standard;

  const handleAddPhoto = async (file: File) => {
    try {
      const url = await WallpaperManager.addCustomWallpaper(file, file.name);
      await queryClient.invalidateQueries({ queryKey: ["wallpapers-list"] });
      setWallpaperName(url);
    } catch (e) {
      console.error("Failed to add custom wallpaper", e);
    }
  };

  return (
    <div className="space-y-6">
      <WallpaperHeader title={t("Title")} description={t("Description")} />

      <WallpaperCurrentPreview
        currentWallpaperName={currentWallpaper?.name || "Wallpaper"}
        currentVariant={currentVariant}
        showOnAllSpacesLabel={t("ShowOnAllSpaces")}
      />

      <WallpaperGrid
        title={t("DynamicWallpapers")}
        wallpapers={builtinWallpapers}
        currentWallpaperName={wallpaperName}
        isDark={isDark}
        onSelect={setWallpaperName}
      />

      <WallpaperCustomPhotos
        title={t("Pictures")}
        addPhotoLabel={t("AddPhoto")}
        customWallpapers={customWallpapers}
        currentWallpaperName={wallpaperName}
        onSelect={setWallpaperName}
        onAddPhoto={handleAddPhoto}
      />
    </div>
  );
};
