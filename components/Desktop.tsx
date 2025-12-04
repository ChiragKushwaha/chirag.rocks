import React, { useEffect, useState } from "react";
import { fs } from "../lib/FileSystem";
import { useMenuStore } from "../store/menuStore";
import { useProcessStore } from "../store/processStore";
import { useSystemStore } from "../store/systemStore";

import dynamic from "next/dynamic";
import NextImage from "next/image";
import { MacFileEntry } from "../lib/types";
import { Dock } from "./Dock";
import { FileIcon } from "./FileIcon";
import { MenuBar } from "./MenuBar";
import { ContextMenu } from "./Menus";
import { WindowManager } from "./WindowManager";

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

export const Desktop: React.FC = () => {
  const {
    wallpaperName,
    theme,
    isBooting,
    setBooting,
    setSelectedFile,
    user,
    setTrashCount,
    brightness,
    isDark,
  } = useSystemStore();

  const wallpaper = WallpaperManager.getWallpaperPath(
    wallpaperName,
    isDark ? "dark" : "light"
  );
  const { notes } = useStickyNoteStore();
  const { openContextMenu } = useMenuStore();
  const { launchProcess } = useProcessStore();
  const [files, setFiles] = useState<MacFileEntry[]>([]);

  // Reminder Worker
  const { reminders, markNotified } = useReminderStore();

  const userName = user?.name || "Guest";
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
              icon: "/icons/reminders.png",
            });
          } else if (
            "Notification" in window &&
            Notification.permission !== "denied"
          ) {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification("Reminder", {
                  body: r.text,
                  icon: "/icons/reminders.png",
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
      try {
        // Always overwrite Resume.pdf to ensure it's not corrupted
        const resumeRes = await fetch("/Resume.pdf");
        const resumeBlob = await resumeRes.blob();
        await fs.writeFile(desktopPath, "Resume.pdf", resumeBlob);
        console.log("Resume.pdf loaded to Desktop ✅");
      } catch (error) {
        console.error("Failed to load Resume.pdf:", error);
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
  const createFolder = async () => {
    const baseName = "untitled folder";
    let name = baseName;
    let counter = 2;

    // Find unique name
    while (await fs.exists(`${desktopPath}/${name}`)) {
      name = `${baseName} ${counter}`;
      counter++;
    }

    await fs.mkdir(`${desktopPath}/${name}`);

    // Refresh files
    const f = await fs.ls(desktopPath);
    setFiles(f);
  };

  // ...

  const openFile = (file: MacFileEntry) => {
    if (file.kind === "directory") {
      launchProcess(
        "finder",
        "Finder",
        "finder",
        <Finder initialPath={file.path} />,
        {
          width: 900,
          height: 600,
          x: 50,
          y: 50,
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
      component: React.ComponentType<any>;
    }

    // App Registry
    const apps: Record<string, AppDefinition> = {
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
      // System Apps (no extension mapping needed usually, but good to have)
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
        <app.component initialPath={desktopPath} initialFilename={file.name} />,
        windowConfig
      );
    } else {
      alert(`No application available to open .${ext} files.`);
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

    // Read and write to move (simplification)
    // TODO: Add fs.move to FileSystem
    try {
      await fs.move(desktopPath, file.name, trashPath, file.name);

      // Refresh Desktop Files
      const f = await fs.ls(desktopPath);
      setFiles(f);

      // Refresh Trash Count & Notify Trash App
      const trashFiles = await fs.ls(trashPath);
      setTrashCount(trashFiles.length);
      window.dispatchEvent(new Event("trash-updated"));
    } catch (e) {
      console.error("Failed to move to bin", e);
      alert("Failed to move to bin. Folder moves not fully supported yet.");
    }
  };

  // --- RIGHT CLICK HANDLER ---
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      { label: "New Folder", action: createFolder },
      { separator: true },
      { label: "Get Info", disabled: true },
      {
        label: "Change Wallpaper...",
        action: () => {
          // Launch System Settings with wallpaper panel
          launchProcess(
            "settings",
            "System Settings",
            "settings",
            <SystemSettings />,
            { width: 900, height: 600, x: 100, y: 100 }
          );
          // Note: We'll need to pass initial tab to SystemSettings
        },
      },
      { separator: true },
      { label: "Use Stacks", disabled: true },
      {
        label: "Sort By",
        submenu: [
          { label: "Name" },
          { label: "Kind" },
          { label: "Date Added" },
          { label: "Date Modified" },
          { label: "Date Created" },
          { label: "Tags" },
        ],
      },
      { label: "Clean Up", disabled: true },
      {
        label: "Clean Up By",
        disabled: true,
        submenu: [
          { label: "Name" },
          { label: "Kind" },
          { label: "Date Modified" },
        ],
      },
      { label: "Show View Options", disabled: true },
    ]);
  };

  if (isBooting) return <BootScreen progress={bootProgress} />;

  return (
    <main
      className="h-screen w-screen overflow-hidden relative"
      onClick={() => {
        setSelectedFile(null);
      }}
      onContextMenu={handleContextMenu} // Capture Right Click on Desktop
    >
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

      {/* Desktop Icons (z-10) */}
      <div
        className="pt-[34px] px-1 grid grid-flow-col grid-rows-[repeat(auto-fill,104px)] gap-y-1 gap-x-0 content-start justify-end h-full pb-20 z-10 relative pointer-events-none direction-rtl"
        style={{ direction: "rtl" }}
      >
        {files.map(
          (file) =>
            !file.isHidden && (
              <div
                key={file.name}
                className={`pointer-events-auto flex justify-center ${
                  file.name.endsWith(".note") ? "w-[160px]" : "w-[100px]"
                }`}
                style={{ direction: "ltr" }} // Reset direction for content
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
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    openFile(file);
                  }}
                  onContextMenu={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    openContextMenu(e.clientX, e.clientY, [
                      {
                        label: "Open",
                        action: () => openFile(file),
                      },
                      {
                        label: "Edit",
                        action: () =>
                          launchProcess(
                            "textedit",
                            "TextEdit",
                            "📝",
                            <TextEdit
                              initialPath={desktopPath}
                              initialFilename={file.name}
                            />
                          ),
                        disabled: ![
                          "txt",
                          "md",
                          "js",
                          "ts",
                          "tsx",
                          "json",
                          "css",
                          "html",
                        ].includes(
                          file.name.split(".").pop()?.toLowerCase() || ""
                        ),
                      },
                      {
                        label: "Open With",
                        submenu: [
                          {
                            label: "TextEdit",
                            action: () =>
                              launchProcess(
                                "textedit",
                                "TextEdit",
                                "📝",
                                <TextEdit
                                  initialPath={desktopPath}
                                  initialFilename={file.name}
                                />
                              ),
                          },
                          {
                            label: "Terminal",
                            action: () =>
                              launchProcess(
                                "terminal",
                                "Terminal",
                                "terminal",
                                <Terminal initialPath={desktopPath} />
                              ),
                          },
                        ],
                      },
                      {
                        label: "Move to Bin",
                        danger: true,
                        action: () => moveToBin(file),
                      },
                      { separator: true },
                      { label: "Get Info" },
                      {
                        label: "Rename",
                        action: () => setRenamingFile(file.name),
                      },
                    ]);
                  }}
                />
              </div>
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
    </main>
  );
};
