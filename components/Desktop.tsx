import React, { useEffect, useState, useRef } from "react";
import { fs } from "../lib/FileSystem";
import { useMenuStore } from "../store/menuStore";
import { useProcessStore } from "../store/processStore";
import { ImportUtils } from "../lib/ImportUtils";
import { useSystemStore } from "../store/systemStore";
import { useFileCopyStore } from "../store/fileCopyStore";
import { useTranslations } from "next-intl";

import dynamic from "next/dynamic";
import NextImage from "next/image";
import { MacFileEntry } from "../lib/types";
import { Dock } from "./Dock";
import { FileIcon } from "./FileIcon";
import { useFileSeeder } from "./hooks/useFileSeeder"; // Import Seeder
import { MenuBar } from "./MenuBar";
import { ContextMenu } from "./Menus";
import { WindowManager } from "./WindowManager";
import { motion } from "framer-motion";

// Dynamic Imports for Apps (Code Splitting)
const Calculator = dynamic(() =>
  import("../apps/Calculator").then((mod) => mod.Calculator)
);
const FaceTime = dynamic(() =>
  import("../apps/FaceTime").then((mod) => mod.FaceTime)
);
const Finder = dynamic(() =>
  import("../apps/Finder/Finder").then((mod) => mod.Finder)
);
const MediaPlayer = dynamic(() =>
  import("../apps/MediaPlayer").then((mod) => mod.MediaPlayer)
);
const Messages = dynamic(() =>
  import("../apps/Messages").then((mod) => mod.Messages)
);
const Notes = dynamic(() => import("../apps/Notes").then((mod) => mod.Notes));
const Spotlight = dynamic(() =>
  import("../apps/Spotlight").then((mod) => mod.Spotlight)
);
const Terminal = dynamic(() =>
  import("../apps/Terminal").then((mod) => mod.Terminal)
);
const TextEdit = dynamic(() =>
  import("../apps/TextEdit").then((mod) => mod.TextEdit)
);
const Trash = dynamic(() => import("../apps/Trash").then((mod) => mod.Trash));
const SystemSettings = dynamic(() =>
  import("../apps/SystemSettings").then((mod) => mod.SystemSettings)
);
const Photos = dynamic(() =>
  import("../apps/Photos").then((mod) => mod.Photos)
);
const V86 = dynamic(() => import("../apps/V86").then((mod) => mod.V86), {
  ssr: false,
});

const PDFViewer = dynamic(
  () => import("../apps/PDFViewer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

import { useReminderStore } from "../store/reminderStore";
import { useStickyNoteStore } from "../store/stickyNoteStore";
import { BootScreen } from "./BootScreen";
import { useAsset, useIconManager } from "./hooks/useIconManager";
import { NotificationCenter } from "./NotificationCenter";
import { StickyNote } from "./StickyNote";

import { WallpaperManager } from "../lib/WallpaperManager";
import { FileCopyWindow } from "./FileCopyWindow";

export const Desktop: React.FC = () => {
  const t = useTranslations("Desktop");
  const tApps = useTranslations("Apps");
  // Initialize File Seeding (Lazy Loading Assets to OPFS)
  useFileSeeder();

  const {
    wallpaperName,
    isBooting,
    setBooting,
    setSelectedFile,
    user,
    setTrashCount,
    brightness,
    isDark,
    iconPositions,
    setIconPosition,
    selectedFiles = [],
    setSelectedFiles,
  } = useSystemStore();

  const wallpaper = WallpaperManager.getWallpaperPath(
    wallpaperName,
    isDark ? "dark" : "light"
  );
  const { notes } = useStickyNoteStore();
  const { openContextMenu } = useMenuStore();
  const { launchProcess } = useProcessStore();
  const [files, setFiles] = useState<MacFileEntry[]>([]);
  const constraintsRef = React.useRef(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [lastClickId, setLastClickId] = useState<string | null>(null);

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
  const dragStartPositions = useRef<Map<string, { x: number; y: number }>>(
    new Map()
  );

  const handleSelectionStart = (e: React.MouseEvent) => {
    // Only start if clicking directly on the desktop container or wallpaper
    // (The main container has the handler, so e.target check might be needed if bubbling)
    // But we put the handler on main, so if we click an icon, e.target will be the icon (or child).
    // We should only start if e.target is the main container or wallpaper div.

    // Actually, simpler: if we are here, and it wasn't stopped by an icon, it's a desktop click.
    // Icons have stopPropagation on click/mousedown usually?
    // FileIcon has onClick stopPropagation.
    // We need to ensure FileIcon also stops propagation on MouseDown if we use MouseDown here.

    if (e.button !== 0) return; // Only left click

    setSelectionBox({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isVisible: true,
    });

    // Clear selection if not holding Shift/Meta
    if (!e.shiftKey && !e.metaKey) {
      setSelectedFiles([]);
    }
  };

  const handleSelectionMove = (e: React.MouseEvent) => {
    if (!selectionBox?.isVisible) return;

    const newBox = {
      ...selectionBox,
      currentX: e.clientX,
      currentY: e.clientY,
    };
    setSelectionBox(newBox);

    // Calculate intersection
    const left = Math.min(newBox.startX, newBox.currentX);
    const top = Math.min(newBox.startY, newBox.currentY);
    const width = Math.abs(newBox.currentX - newBox.startX);
    const height = Math.abs(newBox.currentY - newBox.startY);

    const newSelected: string[] = [];

    fileRefs.current.forEach((el, name) => {
      const rect = el.getBoundingClientRect();
      // Check intersection
      if (
        rect.left < left + width &&
        rect.right > left &&
        rect.top < top + height &&
        rect.bottom > top
      ) {
        newSelected.push(name);
      }
    });

    // If holding shift/meta, we might want to add to existing?
    // For now, let's just set selection to what's in the box.
    // To support "add to selection", we'd need to know what was selected BEFORE drag started.
    // Let's keep it simple: Drag selects exactly what's in box.
    setSelectedFiles(newSelected);
  };

  const handleSelectionEnd = () => {
    if (selectionBox?.isVisible) {
      setSelectionBox(null);
    }
  };

  // Reminder Worker
  const { reminders, markNotified } = useReminderStore();

  const userName = user?.name || t("Guest");
  const userHome = `/Users/${userName}`;
  const desktopPath = `${userHome}/Desktop`;
  const trashPath = `${userHome}/.Trash`;

  // --- DESKTOP FILES RELOAD ---
  // Reload desktop files when component mounts (fixes files disappearing after unlock)
  useEffect(() => {
    const reloadFiles = async () => {
      try {
        const entries = await fs.ls(desktopPath);
        setFiles(entries);
      } catch (error) {
        console.error("[Desktop] Failed to reload files:", error);
      }
    };

    reloadFiles();
  }, [desktopPath, setFiles]); // Run once on mount, re-run if desktopPath or setFiles changes

  // File watcher for desktop changes
  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now();
      reminders.forEach((r) => {
        if (r.dueTime && r.dueTime <= now && !r.notified && !r.completed) {
          // Try Web Notification API first
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("Reminder", {
              body: r.text,
              icon: "/icons/reminders.webp",
            });
          } else if (
            "Notification" in window &&
            Notification.permission !== "denied"
          ) {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification("Reminder", {
                  body: r.text,
                  icon: "/icons/reminders.webp",
                });
              } else {
                alert(`Reminder: ${r.text}`);
              }
            });
          } else {
            // Fallback to alert
            alert(`Reminder: ${r.text}`);
          }
          markNotified(r.id);
        }
      });
    };

    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [reminders, markNotified]);

  // Force update wallpaper if it's the old default

  // Initialize Icon System (Cache icons to OPFS)
  const { isReady: assetsReady } = useIconManager();

  // Load wallpaper from OPFS
  const wallpaperUrl = useAsset(wallpaper);

  const [renamingFile, setRenamingFile] = useState<string | null>(null);

  const handleRename = async (file: MacFileEntry, newName: string) => {
    console.log("handleRename called:", file.name, "->", newName);
    setRenamingFile(null);
    if (!newName || newName === file.name) {
      console.log("Rename cancelled or identical name");
      return;
    }

    try {
      console.log("Executing fs.rename...");
      await fs.rename(desktopPath, file.name, newName);
      console.log("fs.rename success, refreshing list...");
      const f = await fs.ls(desktopPath);
      setFiles(f);
    } catch (err) {
      console.error("Failed to rename:", err);
      alert("Failed to rename: " + err);
    }
  };

  // Boot Logic
  const [bootProgress, setBootProgress] = useState(0);

  useEffect(() => {
    const load = async () => {
      // 1. Wait for Icon System (20%)
      if (!assetsReady) {
        setBootProgress(10);
        return;
      }
      setBootProgress(20);

      // 2. Load Resume.pdf to Desktop (30%)
      const { hasSeededResume, setHasSeededResume } = useSystemStore.getState();

      if (!hasSeededResume) {
        try {
          // Only create if not already seeded
          const resumeRes = await fetch("/Resume.pdf");
          const resumeBlob = await resumeRes.blob();
          await fs.writeFile(desktopPath, "Resume.pdf", resumeBlob);
          console.log("Resume.pdf loaded to Desktop ✅");
          setHasSeededResume(true);
        } catch (error) {
          console.error("Failed to load Resume.pdf:", error);
        }
      } else {
        console.log("Resume.pdf already seeded, skipping.");
      }
      setBootProgress(30);

      // 3. Load Desktop Files (50%)
      const f = await fs.ls(desktopPath);
      setFiles(f);
      setBootProgress(50);

      // 4. Preload Wallpaper (100%)
      if (!wallpaperUrl) {
        // If no wallpaper URL after 3 seconds, just continue
        setTimeout(() => {
          setBootProgress(100);
          setTimeout(() => setBooting(false), 500);
        }, 3000);
        return;
      }

      const img = new Image();
      img.src = wallpaperUrl;

      // Timeout fallback in case image never loads
      const timeout = setTimeout(() => {
        console.warn("Wallpaper load timeout, continuing anyway");
        setBootProgress(100);
        setTimeout(() => setBooting(false), 500);
      }, 5000); // 5 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        setBootProgress(100);
        // Small delay to show 100% before transition
        setTimeout(() => setBooting(false), 500);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        console.error("Failed to load wallpaper:", wallpaperUrl);
        // Only proceed if we really fail, but ideally we shouldn't
        setBootProgress(100);
        setTimeout(() => setBooting(false), 500);
      };
    };

    if (isBooting) {
      load();
    }
  }, [isBooting, setBooting, assetsReady, wallpaperUrl, desktopPath]);

  // Spotlight Hotkey (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useSystemStore.getState().toggleSpotlight();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- ACTIONS ---
  const createFolder = async (x?: number, y?: number) => {
    const baseName = t("UntitledFolder");
    let name = baseName;
    let counter = 2;

    // Find unique name
    while (await fs.exists(`${desktopPath}/${name}`)) {
      name = `${baseName} ${counter}`;
      counter++;
    }

    await fs.mkdir(`${desktopPath}/${name}`);

    // If coordinates provided, set absolute position
    if (x !== undefined && y !== undefined) {
      // Adjust for grid container padding (pt-[34px] = 34px)
      // The grid container is relative, so (0,0) is top-left of container.
      // e.clientY includes menu bar height?
      // If clientY is from the top of the viewport, and the icon container starts at 0,0 of the screen,
      // then clientY is already the correct Y coordinate relative to the screen.
      // The `pt-[34px]` on the grid container means the grid items start 34px down *within that container*.
      // If we set `position: absolute` on an icon, its `top` and `left` are relative to the *nearest positioned ancestor*.
      // In this case, the `main` element, which is `h-screen w-screen relative`.
      // So, `x` and `y` from `e.clientX`, `e.clientY` are already correct relative to the `main` element.
      // We just need to center the icon on the cursor. Icon is roughly 100x104.
      const adjustedX = x - 50; // Center horizontally
      const adjustedY = y - 52; // Center vertically (104/2)

      setIconPosition(name, adjustedX, adjustedY, true);
    }

    // Refresh files
    const f = await fs.ls(desktopPath);
    setFiles(f);
  };

  // ...

  const openFile = (file: MacFileEntry) => {
    if (file.kind === "directory") {
      launchProcess(
        `finder-${file.name}`,
        file.name,
        "finder",
        <Finder initialPath={file.path} />,
        {
          width: 900,
          height: 600,
          x: 75,
          y: 75,
        }
      );
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();

    // ... imports already at top ...

    // ...

    interface AppDefinition {
      id: string;
      name: string;
      icon: string;
      component: React.ComponentType<{
        initialPath?: string;
        initialFilename?: string;
      }>;
    }

    // App Registry
    const apps: Record<string, AppDefinition> = {
      note: {
        id: "notes",
        name: tApps("Notes"),
        icon: "notes",
        component: Notes,
      },
      txt: {
        id: "textedit",
        name: tApps("TextEdit"),
        icon: "📝",
        component: TextEdit,
      },
      md: {
        id: "textedit",
        name: tApps("TextEdit"),
        icon: "📝",
        component: TextEdit,
      },
      mp4: {
        id: "player",
        name: tApps("MediaPlayer"),
        icon: "▶️",
        component: MediaPlayer,
      },
      mp3: {
        id: "player",
        name: tApps("MediaPlayer"),
        icon: "🎵",
        component: MediaPlayer,
      },
      mov: {
        id: "player",
        name: tApps("MediaPlayer"),
        icon: "▶️",
        component: MediaPlayer,
      },
      pdf: {
        id: "preview",
        name: tApps("Preview"),
        icon: "📄",
        component: PDFViewer,
      },
      // System Apps (no extension mapping needed usually, but good to have)
      terminal: {
        id: "terminal",
        name: tApps("Terminal"),
        icon: "terminal",
        component: Terminal,
      },
      calculator: {
        id: "calculator",
        name: tApps("Calculator"),
        icon: "calculator",
        component: Calculator,
      },
      trash: {
        id: "trash",
        name: tApps("Trash"),
        icon: "trash",
        component: Trash,
      },
      messages: {
        id: "messages",
        name: tApps("Messages"),
        icon: "messages",
        component: Messages,
      },
      facetime: {
        id: "facetime",
        name: tApps("FaceTime"),
        icon: "facetime",
        component: FaceTime,
      },
      // Photos App Mappings
      jpg: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      jpeg: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      png: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      gif: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      webp: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      svg: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      ico: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      heic: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      psd: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      ai: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      tiff: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      tif: {
        id: "photos",
        name: tApps("Photos"),
        icon: "photos",
        component: Photos,
      },
      // V86 Emulator
      iso: {
        id: "v86",
        name: tApps("VirtualMachine"),
        icon: "disk_image",
        component: V86,
      },
      img: {
        id: "v86",
        name: tApps("VirtualMachine"),
        icon: "disk_image",
        component: V86,
      },
    };

    const app = ext ? apps[ext] : null;

    if (app) {
      // Special window sizing
      let windowConfig = undefined;

      if (app.id === "preview") {
        windowConfig = { width: 1000, height: 700, x: 100, y: 50 };
      } else if (app.id === "v86") {
        // Fixed size for V86 (standard VGA + chrome)
        windowConfig = {
          width: 1280,
          height: 720,
          x: 100,
          y: 100,
          resizable: false,
        };
      }

      launchProcess(
        `${app.id}-${file.name}`,
        file.name,
        app.icon,
        <app.component initialPath={desktopPath} initialFilename={file.name} />,
        windowConfig
      );
    } else {
      alert(t("NoAppAvailable", { ext: ext || "unknown" }));
    }
  };

  // Listen for external FS changes (e.g. from Trash Put Back)
  useEffect(() => {
    const handleRefresh = () => {
      fs.ls(desktopPath).then(setFiles);
    };
    window.addEventListener("file-system-change", handleRefresh);
    return () =>
      window.removeEventListener("file-system-change", handleRefresh);
  }, [desktopPath]);

  const moveToBin = async (file: MacFileEntry) => {
    // Ensure trash exists
    if (!(await fs.exists(trashPath))) {
      await fs.mkdir(trashPath);
    }

    const store = useFileCopyStore.getState();

    // 1. Start Progress (Moving)
    // Calculate full recursive size for accurate progress
    let totalBytes = await fs.getSize(file.path);
    if (totalBytes === 0 && file.size) {
      totalBytes = file.size;
    }
    store.startCopy(1, totalBytes, "Desktop", "Trash", "move");

    // Read and write to move (simplification)
    // TODO: Add fs.move to FileSystem
    try {
      // Simulate progress for better UX (since fs.move is instant)
      // This prevents the "0 to 100% in 1ms" jump that looks like a glitch
      const steps = 10;
      const duration = 800; // 0.8s duration
      const stepTime = duration / steps;

      for (let i = 1; i <= steps; i++) {
        if (useFileCopyStore.getState().isCancelled) break;
        await new Promise((r) => setTimeout(r, stepTime));
        const simulatedBytes = Math.floor(totalBytes * 0.9 * (i / steps));
        store.updateProgress(0, simulatedBytes, file.name);
      }

      if (useFileCopyStore.getState().isCancelled) {
        store.endCopy();
        return;
      }

      await fs.move(desktopPath, file.name, trashPath, file.name);

      // 2. Update Progress to 100%
      store.updateProgress(1, totalBytes, file.name);

      // Refresh Desktop Files
      const f = await fs.ls(desktopPath);
      setFiles(f);

      // Refresh Trash Count & Notify Trash App
      const trashFiles = await fs.ls(trashPath);
      setTrashCount(trashFiles.length);
      window.dispatchEvent(new Event("trash-updated"));

      // 3. End Progress after short delay
      setTimeout(() => {
        store.endCopy();
      }, 500);
    } catch (e) {
      console.error("Failed to move to bin", e);
      alert(t("MoveToBin.NotSupported"));
      store.endCopy();
    }
  };

  // --- RIGHT CLICK HANDLER ---
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;

    openContextMenu(e.clientX, e.clientY, [
      {
        label: t("ContextMenu.NewFolder"),
        icon: "📁", // TODO: Use better icon
        action: () => createFolder(x, y),
      },
      { separator: true },
      { label: t("ContextMenu.GetInfo"), icon: "ℹ️", disabled: false },
      {
        label: t("ContextMenu.ChangeWallpaper"),
        action: () => {
          // Launch System Settings with wallpaper panel
          launchProcess(
            "settings",
            tApps("SystemSettings"),
            "settings",
            <SystemSettings />,
            { width: 900, height: 600, x: 100, y: 100 }
          );
        },
      },
      { label: t("ContextMenu.EditWidgets"), disabled: true },
      { separator: true },
      { label: t("ContextMenu.UseStacks"), icon: "📚", disabled: true },
      {
        label: t("ContextMenu.SortBy"),
        icon: "⇅",
        submenu: [
          { label: t("ContextMenu.None"), icon: "✓" },
          { separator: true },
          { label: t("ContextMenu.SnapToGrid") },
          { separator: true },
          { label: t("ContextMenu.Name") },
          { label: t("ContextMenu.Kind") },
          { label: t("ContextMenu.DateLastOpened") },
          { label: t("ContextMenu.DateAdded") },
          { label: t("ContextMenu.DateModified") },
          { label: t("ContextMenu.DateCreated") },
          { label: t("ContextMenu.Size") },
          { label: t("ContextMenu.Tags") },
        ],
      },
      { label: t("ContextMenu.CleanUp"), disabled: false },
      {
        label: t("ContextMenu.CleanUpBy"),
        disabled: false,
        submenu: [
          { label: t("ContextMenu.Name") },
          { label: t("ContextMenu.Kind") },
          { label: t("ContextMenu.DateModified") },
          { label: t("ContextMenu.DateCreated") },
          { label: t("ContextMenu.Size") },
          { label: t("ContextMenu.Tags") },
        ],
      },
      { label: t("ContextMenu.ShowViewOptions"), icon: "⚙️", disabled: true },
    ]);
  };

  // File Drop Handler
  const handleDragOver = (e: React.DragEvent) => {
    // Allow drop if it contains files
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    // Check if it's an internal drag (we might want to ignore or handle differently)
    // For now, if it has "Files" and no internal ID, treat as external import
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();

      // Check if it's internal drag (usually we set some text/plain data)
      // But browsers might add "Files" even for internal image drags?
      // Let's assume if we have DataTransferItems of kind 'file', it's an import.

      try {
        await ImportUtils.importItems(e.dataTransfer.items, desktopPath);
        // Refresh
        const f = await fs.ls(desktopPath);
        setFiles(f);
      } catch (err) {
        console.error("Import failed:", err);
        alert("Failed to import files");
      }
    }
  };

  if (isBooting) return <BootScreen progress={bootProgress} />;

  return (
    <div
      ref={constraintsRef}
      className="h-screen w-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onContextMenu={handleContextMenu}
      onMouseDown={handleSelectionStart}
      onMouseMove={handleSelectionMove}
      onMouseUp={handleSelectionEnd}
      onMouseLeave={handleSelectionEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Boot Screen Overlay */}
      {selectionBox?.isVisible && (
        <div
          className="absolute border border-blue-500/50 bg-blue-400/20 z-50 pointer-events-none"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.currentX),
            top: Math.min(selectionBox.startY, selectionBox.currentY),
            width: Math.abs(selectionBox.currentX - selectionBox.startX),
            height: Math.abs(selectionBox.currentY - selectionBox.startY),
          }}
        />
      )}
      {/* Wallpaper Layer (z-0) */}
      <div className="absolute inset-0 z-0">
        <NextImage
          src={wallpaperUrl || wallpaper}
          alt="Wallpaper"
          fill
          priority
          className="object-cover transition-all duration-1000 ease-in-out"
          style={{
            filter: `brightness(${brightness}%)`,
          }}
          unoptimized={!!wallpaperUrl?.startsWith("blob:")}
          quality={90}
        />
      </div>

      {/* Menu Bar (z-40) */}
      <div className="relative z-40">
        <MenuBar />
      </div>

      {/* GLOBAL CONTEXT MENU LAYER (z-50) */}
      <ContextMenu />
      <Spotlight />
      <NotificationCenter />
      <FileCopyWindow />

      {/* Desktop Icons (z-10) */}
      <div
        ref={containerRef}
        className="pt-[34px] px-1 grid grid-flow-col grid-rows-[repeat(auto-fill,104px)] gap-y-1 gap-x-0 content-start justify-end h-full pb-20 z-10 relative pointer-events-none direction-rtl"
        style={{ direction: "rtl" }}
      >
        {files.map(
          (file) =>
            !file.isHidden && (
              <motion.div
                key={file.name}
                drag
                dragMomentum={false}
                dragConstraints={constraintsRef}
                whileDrag={{ scale: 1.05, zIndex: 100 }}
                ref={(el) => {
                  if (el) fileRefs.current.set(file.name, el);
                  else fileRefs.current.delete(file.name);
                }}
                onDragStart={(e) => {
                  // Ensure the dragged file is selected
                  if (!selectedFiles.includes(file.name)) {
                    if (e.metaKey || e.shiftKey) {
                      setSelectedFiles([...selectedFiles, file.name]);
                    } else {
                      setSelectedFiles([file.name]);
                    }
                  }

                  // Capture initial positions for all selected files
                  // We use offsetLeft/Top because they give the position relative to the offsetParent (the grid container)
                  // and are NOT affected by transforms (like scale)
                  dragStartPositions.current.clear();
                  // We need to capture positions for ALL selected files, including the one being dragged
                  // But wait, selectedFiles might not be updated yet if we just called setSelectedFiles?
                  // React state updates are batched.
                  // However, if we just set it, it won't be in `selectedFiles` variable yet.
                  // So we should use a temporary list.

                  let currentSelection = selectedFiles;
                  if (!selectedFiles.includes(file.name)) {
                    if (e.metaKey || e.shiftKey) {
                      currentSelection = [...selectedFiles, file.name];
                    } else {
                      currentSelection = [file.name];
                    }
                  }

                  currentSelection.forEach((name) => {
                    const el = fileRefs.current.get(name);
                    if (el) {
                      // For absolute items, offsetLeft/Top will be 0 if left/top are 0.
                      // We need their actual visual position, which is stored in iconPositions.
                      // For relative items, offsetLeft/Top is correct.
                      const isAbsolute = iconPositions[name]?.absolute;
                      const initialX = isAbsolute
                        ? iconPositions[name]?.x || 0
                        : el.offsetLeft;
                      const initialY = isAbsolute
                        ? iconPositions[name]?.y || 0
                        : el.offsetTop;

                      dragStartPositions.current.set(name, {
                        x: initialX,
                        y: initialY,
                      });
                    }
                  });
                }}
                onDrag={(_, info) => {
                  // Move other selected files visually
                  selectedFiles.forEach((name) => {
                    if (name === file.name) return; // Skip the one being dragged (handled by framer-motion)
                    const startPos = dragStartPositions.current.get(name);
                    if (startPos) {
                      // We need to calculate the NEW transform based on the drag offset.
                      // But wait, the element is at `startPos` (layout position).
                      // We want to move it by `info.offset`.
                      // But `transform` is relative to the element's current layout position.
                      // So `translate(info.offset.x, info.offset.y)` should work!
                      // Wait, `iconPositions` might have `x` and `y` set if it was absolute.
                      // If it was absolute, `left: 0, top: 0`, and `transform: translate(x, y)` (via style x/y props).
                      // Framer Motion applies `x` and `y` style props as `transform`.
                      // If we manually set `transform`, we override Framer Motion's style props?
                      // Yes.
                      // So if it was absolute at (100, 100), `x=100, y=100`.
                      // `offsetLeft` would be 0 (because `left:0`).
                      // Wait, if `position: absolute`, `offsetLeft` is `left` + `margin`?
                      // If `left: 0`, `offsetLeft` is 0.
                      // But visual position is `100, 100` due to `transform`.

                      // Ah, for absolute items with Framer Motion `x/y` props, `offsetLeft` is 0.
                      // But `startPos` should be the VISUAL start position.
                      // If `absolute`, `startPos` should be `iconPositions[name].x`.
                      // If `relative`, `startPos` is `offsetLeft`.

                      // Actually, let's simplify.
                      // We just want to move them by `info.offset`.
                      // If we set `transform: translate3d(info.offset.x px, info.offset.y px, 0)`,
                      // it moves relative to its CURRENT position (which includes `x/y` props).
                      // NO! `transform` overrides the `transform` generated by `x/y` props.
                      // So if we set `transform`, we lose the initial `x/y` position!

                      // So we must calculate the FULL transform.
                      // If absolute: `newX = currentX + info.offset.x`.
                      // If relative: `newX = info.offset.x`. (Because relative starts at 0 transform).

                      const el = fileRefs.current.get(name);
                      if (el) {
                        const currentX = startPos.x; // Use the captured start position
                        const currentY = startPos.y; // Use the captured start position

                        const moveX = currentX + info.offset.x;
                        const moveY = currentY + info.offset.y;

                        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.05)`;
                        el.style.zIndex = "100";
                      }
                    }
                  });
                }}
                onDragEnd={(_, info) => {
                  selectedFiles.forEach((name) => {
                    // Calculate final position
                    // If absolute: startX + offset
                    // If relative: offsetLeft + offset

                    // We need the start position we captured?
                    // If we captured `offsetLeft`, for absolute items it was 0.
                    // So we should have captured `x/y` from store for absolute items?

                    // Let's use the logic:
                    // FinalX = InitialVisualX + OffsetX
                    // InitialVisualX = Absolute ? Store.x : offsetLeft

                    const startPos = dragStartPositions.current.get(name);
                    if (!startPos) return; // Should not happen if dragStartPositions was populated correctly

                    const newX = startPos.x + info.offset.x;
                    const newY = startPos.y + info.offset.y;

                    setIconPosition(name, newX, newY, true);

                    // Reset styles for all selected files that were manually transformed
                    const el = fileRefs.current.get(name);
                    if (el) {
                      el.style.transform = "";
                      el.style.zIndex = "";
                    }
                  });
                }}
                className={`pointer-events-auto flex justify-center ${
                  file.name.endsWith(".note") ? "w-[160px]" : "w-[100px]"
                }`}
                style={{
                  direction: "ltr",
                  position: iconPositions[file.name]?.absolute
                    ? "absolute"
                    : "relative",
                  left: iconPositions[file.name]?.absolute ? 0 : "auto",
                  top: iconPositions[file.name]?.absolute ? 0 : "auto",
                  x: iconPositions[file.name]?.x || 0,
                  y: iconPositions[file.name]?.y || 0,
                }} // Reset direction for content
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  openFile(file);
                }}
              >
                <FileIcon
                  name={file.name}
                  kind={file.kind}
                  isRenaming={renamingFile === file.name}
                  onRename={(newName) => handleRename(file, newName)}
                  onRenameCancel={() => setRenamingFile(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    const now = Date.now();
                    if (
                      lastClickId === file.name &&
                      now - lastClickTime < 300
                    ) {
                      // Double click detected
                      openFile(file);
                      setLastClickId(null);
                      setLastClickTime(0);
                    } else {
                      // Single click
                      setSelectedFile(file.name);
                      setLastClickId(file.name);
                      setLastClickTime(now);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    // If right-clicking an unselected file, select it (and deselect others)
                    let currentSelection = selectedFiles;
                    if (!selectedFiles.includes(file.name)) {
                      setSelectedFiles([file.name]);
                      currentSelection = [file.name];
                    }

                    if (currentSelection.length > 1) {
                      // Multi-select Context Menu
                      openContextMenu(e.clientX, e.clientY, [
                        {
                          label: `Open ${currentSelection.length} items`,
                          action: () => {
                            currentSelection.forEach((name) => {
                              const f = files.find(
                                (file) => file.name === name
                              );
                              if (f) openFile(f);
                            });
                          },
                        },
                        { separator: true },
                        {
                          label: `Move ${currentSelection.length} items to Bin`,
                          danger: true,
                          action: async () => {
                            for (const name of currentSelection) {
                              const f = files.find(
                                (file) => file.name === name
                              );
                              if (f) await moveToBin(f);
                            }
                          },
                        },
                      ]);
                    } else {
                      // Single-select Context Menu (Updated to match screenshot)
                      openContextMenu(e.clientX, e.clientY, [
                        {
                          label: "Open",
                          action: () => openFile(file),
                        },
                        {
                          label: "Move to Bin",
                          icon: "🗑️",
                          action: () => moveToBin(file),
                        },
                        { separator: true },
                        { label: "Get Info" },
                        {
                          label: "Rename",
                          action: () => setRenamingFile(file.name),
                        },
                        { separator: true },
                        { label: `Compress "${file.name}"` },
                        { label: "Duplicate" },
                        { label: "Make Alias" },
                        { label: "Quick Look" },
                        { separator: true },
                        { label: "Copy" },
                        { label: "Share..." },
                        { separator: true },
                        { type: "tags" },
                        { separator: true },
                        { label: "Customise Folder..." },
                        { separator: true },
                        {
                          label: "Quick Actions",
                          submenu: [{ label: "Customize..." }],
                        },
                        {
                          label: "Services",
                          submenu: [{ label: "No Services Apply" }],
                        },
                      ]);
                    }
                  }}
                />
              </motion.div>
            )
        )}
      </div>

      {/* Sticky Notes (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {notes.map((note) => (
          <div key={note.id} className="pointer-events-auto">
            <StickyNote note={note} />
          </div>
        ))}
      </div>

      {/* Window Manager (z-20) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <WindowManager />
      </div>

      {/* Dock (z-30) */}
      <div className="relative z-30">
        <Dock />
      </div>
    </div>
  );
};
