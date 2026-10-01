"use client";
import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { WindowManager } from "./WindowManager";
import { StickyNote } from "./StickyNote";
import { BootScreen } from "./BootScreen";
import { DesktopIconGrid } from "./desktop/DesktopIconGrid";
import { DesktopSelectionBox } from "./desktop/DesktopSelectionBox";
import { DesktopWallpaper } from "./desktop/DesktopWallpaper";
import { DesktopOverlays } from "./desktop/DesktopOverlays";
import { useDesktopState } from "./desktop/useDesktopState";
import { useDesktopSelection } from "./desktop/useDesktopSelection";
import { useWallpaperLoader } from "./desktop/useWallpaperLoader";
import { useSpotlightShortcut } from "./desktop/useSpotlightShortcut";
import { handleDesktopContextMenu } from "./desktop/DesktopContextMenu";
import { useFileSeeder } from "./hooks/useFileSeeder";

export const Desktop: React.FC = () => {
  const t = useTranslations("Desktop");
  useFileSeeder();
  useSpotlightShortcut();

  const {
    assetsReady,
    system,
    notes,
    openContextMenu,
    launchProcess,
    bootProgress,
    setBootProgress,
    wallpaper,
    wallpaperUrl,
    files,
    refreshFiles,
    ops,
  } = useDesktopState();

  const constraintsRef = useRef<HTMLDivElement>(null);
  const fileRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const dragStartPositions = useRef<Map<string, { x: number; y: number }>>(new Map());
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [lastClickId, setLastClickId] = useState<string | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);

  const { selectionBox, startSelection, updateSelection, endSelection } =
    useDesktopSelection(files, fileRefs, system.setSelectedFiles);

  useWallpaperLoader({
    wallpaperUrl,
    assetsReady,
    isBooting: system.isBooting,
    setBooting: system.setBooting,
    setBootProgress,
  });

  if (system.isBooting) return <BootScreen progress={bootProgress} />;

  return (
    <div
      ref={constraintsRef}
      className="h-screen w-screen overflow-hidden relative select-none"
      onContextMenu={(e) =>
        handleDesktopContextMenu(e, {
          openContextMenu,
          onCreateFolder: ops.createNewFolder,
          onRefresh: refreshFiles,
          onOpenSettings: () => launchProcess("settings", "System Settings", "settings", null),
          t,
        })
      }
      onMouseDown={startSelection}
      onTouchStart={startSelection}
      onMouseMove={updateSelection}
      onTouchMove={updateSelection}
      onMouseUp={endSelection}
      onTouchEnd={endSelection}
      onMouseLeave={endSelection}
    >
      <DesktopSelectionBox selectionBox={selectionBox} />
      <DesktopWallpaper src={wallpaperUrl || wallpaper} brightness={system.brightness} />
      <div className="relative z-40"><MenuBar /></div>
      <DesktopOverlays />
      <DesktopIconGrid
        files={files}
        constraintsRef={constraintsRef}
        fileRefs={fileRefs}
        selectedFiles={system.selectedFiles}
        setSelectedFiles={system.setSelectedFiles}
        dragStartPositions={dragStartPositions}
        iconPositions={system.iconPositions}
        setIconPosition={system.setIconPosition}
        renamingFile={renamingFile}
        setRenamingFile={setRenamingFile}
        handleRename={ops.handleRename}
        openFile={ops.openFile}
        setSelectedFile={system.setSelectedFile}
        setLastClickId={setLastClickId}
        setLastClickTime={setLastClickTime}
        lastClickId={lastClickId}
        lastClickTime={lastClickTime}
        openContextMenu={openContextMenu}
        moveToBin={ops.moveToBin}
      />
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {notes.map((note) => (
          <div key={note.id} className="pointer-events-auto">
            <StickyNote note={note} />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 z-20 pointer-events-none"><WindowManager /></div>
      <div className="relative z-30"><Dock /></div>
    </div>
  );
};
