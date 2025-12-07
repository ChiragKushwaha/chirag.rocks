import React, { useEffect, useState, useRef } from "react";
import { fs } from "../../lib/FileSystem";
import { useTranslations } from "next-intl";
import { Sidebar } from "./Sidebar";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  Search,
} from "lucide-react";
import { MacFileEntry } from "../../lib/types";
import { MacOSInput } from "../../components/ui/MacOSDesignSystem"; // Import new UI

import { useSystemStore } from "../../store/systemStore";
import { useMenuStore } from "../../store/menuStore";
import { useProcessStore } from "../../store/processStore";
import { FileIcon } from "../../components/FileIcon";
import { TrashUtils } from "../../lib/TrashUtils";

// App Imports
import { TextEdit } from "../TextEdit";
import { MediaPlayer } from "../MediaPlayer";
import { Terminal } from "../Terminal";
import { Calculator } from "../Calculator";
import { Trash } from "../Trash";
import { Messages } from "../Messages";
import { FaceTime } from "../FaceTime";
import { Notes } from "../Notes";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("../PDFViewer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const Photos = dynamic(() =>
  import("../../apps/Photos").then((mod) => mod.Photos)
);

interface FinderProps {
  initialPath?: string;
}

export const Finder: React.FC<FinderProps> = ({ initialPath }) => {
  const { user } = useSystemStore();
  const { launchProcess } = useProcessStore();
  const defaultPath = `/Users/${user.name || "Guest"}`;

  const t = useTranslations("Finder");
  const tMenu = useTranslations("Finder.Menu");
  const tStatus = useTranslations("Finder.Status");
  const tErrors = useTranslations("Finder.Errors");

  // Navigation State
  const [currentPath, setCurrentPath] = useState(initialPath || defaultPath);
  const [history, setHistory] = useState<string[]>([
    initialPath || defaultPath,
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Data State
  const [files, setFiles] = useState<MacFileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  // 1. Fetch Files from OPFS
  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      const entries = await fs.ls(currentPath);
      setFiles(entries);
      setLoading(false);
    };
    loadFiles();
  }, [currentPath]);

  // 2. Navigation Handlers
  const handleNavigate = (path: string) => {
    if (path === currentPath) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setSelectedItems([]);
    setLastSelectedId(null);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
      setSelectedItems([]);
      setLastSelectedId(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
      setSelectedItems([]);
      setLastSelectedId(null);
    }
  };

  const openFile = (file: MacFileEntry) => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    // App Registry
    const apps: Record<
      string,
      {
        id: string;
        name: string;
        icon: string;
        component: React.ComponentType<any>;
      }
    > = {
      note: {
        id: "notes",
        name: "Notes",
        icon: "notes",
        component: Notes,
      },
      txt: {
        id: "textedit",
        name: "TextEdit",
        icon: "📝",
        component: TextEdit,
      },
      md: {
        id: "textedit",
        name: "TextEdit",
        icon: "📝",
        component: TextEdit,
      },
      mp4: {
        id: "player",
        name: "Media Player",
        icon: "▶️",
        component: MediaPlayer,
      },
      mp3: {
        id: "player",
        name: "Media Player",
        icon: "🎵",
        component: MediaPlayer,
      },
      mov: {
        id: "player",
        name: "Media Player",
        icon: "▶️",
        component: MediaPlayer,
      },
      pdf: {
        id: "preview",
        name: "Preview",
        icon: "📄",
        component: PDFViewer,
      },
      // System Apps
      terminal: {
        id: "terminal",
        name: "Terminal",
        icon: "terminal",
        component: Terminal,
      },
      calculator: {
        id: "calculator",
        name: "Calculator",
        icon: "calculator",
        component: Calculator,
      },
      trash: {
        id: "trash",
        name: "Trash",
        icon: "trash",
        component: Trash,
      },
      messages: {
        id: "messages",
        name: "Messages",
        icon: "messages",
        component: Messages,
      },
      facetime: {
        id: "facetime",
        name: "FaceTime",
        icon: "facetime",
        component: FaceTime,
      },
      // Photos App Mappings
      jpg: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      jpeg: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      png: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      gif: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      webp: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      svg: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      ico: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      heic: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      psd: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      ai: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      tiff: { id: "photos", name: "Photos", icon: "photos", component: Photos },
      tif: { id: "photos", name: "Photos", icon: "photos", component: Photos },
    };

    const app = ext ? apps[ext] : null;

    if (app) {
      // Special window sizing for Preview (PDF Viewer)
      const windowConfig =
        app.id === "preview"
          ? { width: 1000, height: 700, x: 100, y: 50 }
          : undefined;

      launchProcess(
        app.id,
        file.name,
        app.icon,
        <app.component initialPath={currentPath} initialFilename={file.name} />,
        windowConfig
      );
    } else {
      alert(tErrors("NoApp", { ext: ext || "unknown" }));
    }
  };

  const handleDoubleClick = (entry: MacFileEntry) => {
    if (entry.kind === "directory") {
      handleNavigate(entry.path);
    } else {
      openFile(entry);
    }
  };

  // 3. Context Menu & Actions
  const { openContextMenu } = useMenuStore();
  const trashPath = `/Users/${user.name || "Guest"}/.Trash`;

  const createFolder = async () => {
    const baseName = "untitled folder";
    let name = baseName;
    let counter = 2;

    // Find unique name
    while (await fs.exists(`${currentPath}/${name}`)) {
      name = `${baseName} ${counter}`;
      counter++;
    }

    try {
      await fs.mkdir(`${currentPath}/${name}`);
      // Refresh files
      const entries = await fs.ls(currentPath);
      setFiles(entries);
    } catch (err) {
      console.error("Failed to create folder:", err);
      alert(tErrors("CreateFolderFailed"));
    }
  };

  // ... (existing imports)

  const handleMoveToBin = async (items: string[]) => {
    try {
      for (const item of items) {
        // Save metadata before moving
        await TrashUtils.addToMetadata(trashPath, item, currentPath);
        await fs.move(currentPath, item, trashPath, item);
      }
      // Refresh files
      const entries = await fs.ls(currentPath);
      setFiles(entries);
      setSelectedItems([]);
      setLastSelectedId(null);
    } catch (err) {
      console.error("Failed to move to bin:", err);
      alert(tErrors("MoveToBinFailed"));
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY, [
      {
        label: tMenu("NewFolder"),
        action: createFolder,
      },
      { separator: true },
      { label: tMenu("GetInfo"), disabled: true },
      { label: tMenu("ChangeBackground"), disabled: true },
    ]);
  };

  const handleFileClick = (e: React.MouseEvent, file: MacFileEntry) => {
    e.stopPropagation();

    if (e.metaKey || e.ctrlKey) {
      // Toggle selection
      if (selectedItems.includes(file.name)) {
        setSelectedItems(selectedItems.filter((id) => id !== file.name));
      } else {
        setSelectedItems([...selectedItems, file.name]);
        setLastSelectedId(file.name);
      }
    } else if (e.shiftKey && lastSelectedId) {
      // Range selection
      const lastIndex = files.findIndex((f) => f.name === lastSelectedId);
      const currentIndex = files.findIndex((f) => f.name === file.name);

      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        const range = files.slice(start, end + 1).map((f) => f.name);

        // Merge with existing selection or replace? macOS replaces usually but keeps modifier logic.
        // Simple shift behavior: replace selection with range.
        setSelectedItems(range);
      }
    } else {
      // Single selection
      setSelectedItems([file.name]);
      setLastSelectedId(file.name);
    }
  };

  const handleFileContextMenu = (e: React.MouseEvent, file: MacFileEntry) => {
    e.stopPropagation();
    e.preventDefault();

    let currentSelection = selectedItems;
    if (!selectedItems.includes(file.name)) {
      setSelectedItems([file.name]);
      setLastSelectedId(file.name);
      currentSelection = [file.name];
    }

    if (currentSelection.length > 1) {
      openContextMenu(e.clientX, e.clientY, [
        {
          label: tMenu("OpenItems", { count: currentSelection.length }),
          action: () => {
            currentSelection.forEach((name) => {
              const f = files.find((file) => file.name === name);
              if (f) openFile(f);
            });
          },
        },
        { separator: true },
        {
          label: tMenu("MoveItemsToBin", { count: currentSelection.length }),
          danger: true,
          action: () => handleMoveToBin(currentSelection),
        },
      ]);
    } else {
      openContextMenu(e.clientX, e.clientY, [
        {
          label: tMenu("Open"),
          action: () => openFile(file),
        },
        {
          label: tMenu("MoveToBin"),
          danger: true,
          action: () => handleMoveToBin([file.name]),
        },
        { separator: true },
        { label: tMenu("GetInfo"), disabled: true },
        { label: tMenu("Rename"), disabled: true },
      ]);
    }
  };

  // Selection Box State
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isVisible: boolean;
  } | null>(null);

  const fileRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelectionStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX =
      e.clientX - containerRect.left + containerRef.current.scrollLeft;
    const relativeY =
      e.clientY - containerRect.top + containerRef.current.scrollTop;

    setSelectionBox({
      startX: relativeX,
      startY: relativeY,
      currentX: relativeX,
      currentY: relativeY,
      isVisible: true,
    });

    // Clear selection if not holding Shift/Meta
    if (!e.shiftKey && !e.metaKey) {
      setSelectedItems([]);
      setLastSelectedId(null);
    }
  };

  const handleSelectionMove = (e: React.MouseEvent) => {
    if (!selectionBox?.isVisible || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX =
      e.clientX - containerRect.left + containerRef.current.scrollLeft;
    const relativeY =
      e.clientY - containerRect.top + containerRef.current.scrollTop;

    const newBox = {
      ...selectionBox,
      currentX: relativeX,
      currentY: relativeY,
    };
    setSelectionBox(newBox);

    // Calculate intersection (in Viewport coordinates)
    const boxLeft = Math.min(newBox.startX, newBox.currentX);
    const boxTop = Math.min(newBox.startY, newBox.currentY);
    const boxWidth = Math.abs(newBox.currentX - newBox.startX);
    const boxHeight = Math.abs(newBox.currentY - newBox.startY);

    const viewportLeft =
      boxLeft + containerRect.left - containerRef.current.scrollLeft;
    const viewportTop =
      boxTop + containerRect.top - containerRef.current.scrollTop;

    const newSelected: string[] = [];

    fileRefs.current.forEach((el, name) => {
      const rect = el.getBoundingClientRect();
      // Check intersection
      if (
        rect.left < viewportLeft + boxWidth &&
        rect.right > viewportLeft &&
        rect.top < viewportTop + boxHeight &&
        rect.bottom > viewportTop
      ) {
        newSelected.push(name);
      }
    });

    setSelectedItems(newSelected);
  };

  const handleSelectionEnd = () => {
    if (selectionBox?.isVisible) {
      setSelectionBox(null);
    }
  };

  return (
    <div className="flex h-full w-full text-gray-800 font-sans bg-white dark:bg-[#1E1E1E] rounded-xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10">
      {/* SIDEBAR - Full Height */}
      <div className="w-[220px] bg-[#F5F5F5]/80 dark:bg-[#282828]/80 backdrop-blur-2xl border-r border-[#D1D1D6] dark:border-black/50 shrink-0 flex flex-col pt-10">
        <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 min-w-0 bg-white dark:bg-[#1E1E1E]">
        {/* TOOLBAR */}
        <div className="h-[52px] flex items-center px-4 justify-between shrink-0 window-drag-handle border-b border-[#D1D1D6]/50 dark:border-black/20">
          <div className="flex items-center gap-4">
            {/* Navigation Arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleBack}
                disabled={historyIndex === 0}
                className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Go back"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <button
                onClick={handleForward}
                disabled={historyIndex === history.length - 1}
                className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Go forward"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Current Folder Title */}
            <div className="font-semibold text-[14px] flex items-center gap-2 text-gray-700 dark:text-gray-200">
              {currentPath.split("/").pop() || "Macintosh HD"}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="flex bg-black/5 dark:bg-white/10 p-0.5 rounded-[6px]">
              <button
                className="p-1 rounded-[4px] hover:bg-white dark:hover:bg-gray-600 shadow-sm transition-all text-gray-700 dark:text-gray-200"
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                className="p-1 rounded-[4px] hover:bg-white dark:hover:bg-gray-600 transition-all text-gray-500 dark:text-gray-400"
                aria-label="List view"
              >
                <ListIcon size={15} />
              </button>
            </div>

            <div className="w-48">
              <MacOSInput
                placeholder={t("Search")}
                icon={<Search size={13} />}
              />
            </div>
          </div>
        </div>

        {/* FILE GRID */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4 relative"
          onMouseDown={handleSelectionStart}
          onMouseMove={handleSelectionMove}
          onMouseUp={handleSelectionEnd}
          onMouseLeave={handleSelectionEnd}
          onContextMenu={handleContextMenu}
        >
          {/* Selection Box */}
          {selectionBox?.isVisible && (
            <div
              className="absolute border border-blue-500 bg-blue-500/20 z-50 pointer-events-none"
              style={{
                left: Math.min(selectionBox.startX, selectionBox.currentX),
                top: Math.min(selectionBox.startY, selectionBox.currentY),
                width: Math.abs(selectionBox.currentX - selectionBox.startX),
                height: Math.abs(selectionBox.currentY - selectionBox.startY),
              }}
            />
          )}

          {loading ? (
            <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
              {tStatus("Loading")}
            </div>
          ) : files.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 text-sm">
              <span className="text-5xl mb-4 opacity-20">
                <MacFolderIcon className="w-20 h-20" />
              </span>
              <span>{tStatus("EmptyFolder")}</span>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 auto-rows-min">
              {files.map(
                (file) =>
                  !file.isHidden && (
                    <div
                      key={file.name}
                      ref={(el) => {
                        if (el) fileRefs.current.set(file.name, el);
                        else fileRefs.current.delete(file.name);
                      }}
                      className="flex justify-center"
                      onClick={(e) => handleFileClick(e, file)}
                      onContextMenu={(e) => handleFileContextMenu(e, file)}
                      onDoubleClick={() => handleDoubleClick(file)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          if (e.metaKey || e.ctrlKey) {
                            handleDoubleClick(file);
                          } else {
                            setSelectedItems([file.name]);
                            setLastSelectedId(file.name);
                          }
                        }
                      }}
                      aria-label={`${file.name}${
                        selectedItems.includes(file.name) ? ", selected" : ""
                      }`}
                    >
                      <div className="scale-75 origin-top">
                        <FileIcon
                          name={file.name}
                          kind={file.kind}
                          selected={selectedItems.includes(file.name)}
                          onClick={(e) => handleFileClick(e, file)}
                          onDoubleClick={() => {
                            handleDoubleClick(file);
                          }}
                        />
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        {/* STATUS BAR */}
        <div className="h-6 bg-[#F6F6F6] dark:bg-[#282828] border-t border-[#D1D1D6] dark:border-black/50 flex items-center px-4 text-[11px] text-gray-500 dark:text-gray-400 select-none justify-between">
          <span>{tStatus("ItemCount", { count: files.length })}</span>
          <span>{tStatus("SpaceAvailable", { amount: 499 })}</span>
        </div>
      </div>
    </div>
  );
};

const MacFolderIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="folderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5FC9F8" />
        <stop offset="100%" stopColor="#0984FF" />
      </linearGradient>
      <linearGradient id="folderGradientBack" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7AD5F9" />
        <stop offset="100%" stopColor="#2D9CFF" />
      </linearGradient>
      <filter id="folderShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
      </filter>
    </defs>
    <path
      d="M10 28 C10 22 14 20 18 20 H36 L42 25 H82 C86 25 90 29 90 33 V80 C90 85 86 90 80 90 H20 C14 90 10 85 10 80 V28 Z"
      fill="url(#folderGradientBack)"
    />
    <path
      d="M10 40 C10 35 14 32 18 32 H82 C86 32 90 36 90 40 V80 C90 85 86 90 80 90 H20 C14 90 10 85 10 80 V40 Z"
      fill="url(#folderGradient)"
      filter="url(#folderShadow)"
    />
  </svg>
);
