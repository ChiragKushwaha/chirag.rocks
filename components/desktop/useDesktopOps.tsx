import React, { useCallback } from "react";
import { MacFileEntry } from "../../lib/types";
import { fs } from "../../lib/FileSystem";
import { getAppForFile } from "./fileLaunchMap";
import dynamic from "next/dynamic";

const Finder = dynamic(() =>
  import("../../apps/Finder/Finder").then((mod) => mod.Finder)
);

interface DesktopOpsProps {
  desktopPath: string;
  trashPath: string;
  refreshFiles: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  launchProcess: (...args: any[]) => void;
}

export function useDesktopOps({
  desktopPath,
  trashPath,
  refreshFiles,
  launchProcess,
}: DesktopOpsProps) {
  const openFile = useCallback(
    (file: MacFileEntry) => {
      if (file.kind === "directory") {
        launchProcess(
          `finder-${file.name}`,
          file.name,
          "finder",
          <Finder initialPath={file.path} />,
          { width: 900, height: 600, x: 75, y: 75 }
        );
        return;
      }

      const app = getAppForFile(file, desktopPath);
      launchProcess(
        `${app.id}-${file.name}`,
        file.name,
        app.icon,
        app.component,
        app.windowConfig
      );
    },
    [desktopPath, launchProcess]
  );

  const createNewFolder = useCallback(async () => {
    try {
      let name = "untitled folder";
      let count = 1;
      while (await fs.exists(`${desktopPath}/${name}`)) {
        name = `untitled folder ${count++}`;
      }
      await fs.mkdir(`${desktopPath}/${name}`);
      refreshFiles();
    } catch (err) {
      console.error("[useDesktopOps] Failed to create folder:", err);
    }
  }, [desktopPath, refreshFiles]);

  const handleRename = useCallback(
    async (file: MacFileEntry, newName: string) => {
      if (!newName || newName === file.name) return;
      try {
        await fs.rename(desktopPath, file.name, newName);
        refreshFiles();
      } catch (err) {
        console.error("[useDesktopOps] Failed to rename:", err);
      }
    },
    [desktopPath, refreshFiles]
  );

  const moveToBin = useCallback(
    async (file: MacFileEntry) => {
      try {
        if (!(await fs.exists(trashPath))) await fs.mkdir(trashPath);
        await fs.move(desktopPath, file.name, trashPath, file.name);
        refreshFiles();
      } catch (err) {
        console.error("[useDesktopOps] Failed to move to trash:", err);
      }
    },
    [desktopPath, trashPath, refreshFiles]
  );

  const setAsWallpaper = useCallback(
    async (file: MacFileEntry) => {
      try {
        const blob = await fs.readBlob(desktopPath, file.name);
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const { setWallpaperName } = await import("../../store/systemStore").then(
          (m) => m.useSystemStore.getState()
        );
        setWallpaperName(url);
      } catch (err) {
        console.error("[useDesktopOps] Failed to set wallpaper:", err);
      }
    },
    [desktopPath]
  );

  return { openFile, createNewFolder, handleRename, moveToBin, setAsWallpaper };
}
