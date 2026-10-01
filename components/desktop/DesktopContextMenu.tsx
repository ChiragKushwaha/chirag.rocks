import React from "react";
import { MenuItem } from "../../store/menuStore";
import { MacFileEntry } from "../../lib/types";

interface DesktopMenuCallbacks {
  openContextMenu: (x: number, y: number, items: MenuItem[]) => void;
  onCreateFolder: () => void;
  onRefresh: () => void;
  onOpenSettings: () => void;
  t: (key: string) => string;
}

export function handleDesktopContextMenu(
  e: React.MouseEvent,
  { openContextMenu, onCreateFolder, onRefresh, onOpenSettings, t }: DesktopMenuCallbacks
) {
  e.preventDefault();
  openContextMenu(e.clientX, e.clientY, [
    { label: t("ContextMenu.NewFolder"), action: onCreateFolder },
    { label: t("ContextMenu.GetInfo"), disabled: true },
    { label: t("ContextMenu.ChangeWallpaper"), action: onOpenSettings },
    { type: "separator" },
    { label: t("ContextMenu.SortBy"), submenu: [{ label: t("ContextMenu.Name") }] },
    { label: t("ContextMenu.CleanUp"), action: onRefresh },
  ]);
}

interface FileMenuCallbacks {
  openContextMenu: (x: number, y: number, items: MenuItem[]) => void;
  onOpenFile: (file: MacFileEntry) => void;
  onDeleteFile: (file: MacFileEntry) => void;
  t: (key: string) => string;
}

export function handleFileContextMenu(
  e: React.MouseEvent,
  file: MacFileEntry,
  { openContextMenu, onOpenFile, onDeleteFile, t }: FileMenuCallbacks
) {
  e.preventDefault();
  e.stopPropagation();
  openContextMenu(e.clientX, e.clientY, [
    { label: t("ContextMenu.Open"), action: () => onOpenFile(file) },
    { type: "separator" },
    { label: t("ContextMenu.MoveToTrash"), action: () => onDeleteFile(file) },
    { type: "separator" },
    { label: t("ContextMenu.GetInfo"), disabled: true },
  ]);
}
