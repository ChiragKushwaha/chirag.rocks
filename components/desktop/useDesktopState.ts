import { useState } from "react";
import { useSystemStore } from "../../store/systemStore";
import { useStickyNoteStore } from "../../store/stickyNoteStore";
import { useMenuStore } from "../../store/menuStore";
import { useProcessStore } from "../../store/processStore";
import { WallpaperManager } from "../../lib/WallpaperManager";
import { useAsset, useIconManager } from "../hooks/useIconManager";
import { useDesktopFiles } from "./useDesktopFiles";
import { useDesktopOps } from "./useDesktopOps";

export function useDesktopState() {
  const { isReady: assetsReady } = useIconManager();
  const system = useSystemStore();
  const { notes } = useStickyNoteStore();
  const { openContextMenu } = useMenuStore();
  const { launchProcess } = useProcessStore();

  const [bootProgress, setBootProgress] = useState(10);
  const wallpaper = WallpaperManager.getWallpaperPath(system.wallpaperName, system.isDark ? "dark" : "light");
  const wallpaperUrl = useAsset(wallpaper);

  const userName = system.user?.name || "Guest";
  const desktopPath = `/Users/${userName}/Desktop`;
  const trashPath = `/Users/${userName}/.Trash`;

  const { files, refreshFiles } = useDesktopFiles(desktopPath);
  const ops = useDesktopOps({
    desktopPath,
    trashPath,
    refreshFiles,
    launchProcess,
  });

  return {
    assetsReady,
    system,
    notes,
    openContextMenu,
    launchProcess,
    bootProgress,
    setBootProgress,
    wallpaper,
    wallpaperUrl,
    desktopPath,
    files,
    refreshFiles,
    ops,
  };
}
