import React, { useEffect, useState } from "react";
import { fs } from "../lib/FileSystem";
import { useSystemStore } from "../store/systemStore";
import { useMenuStore } from "../store/menuStore";
import { useProcessStore } from "../store/processStore";

import { ContextMenu } from "./Menus";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { WindowManager } from "./WindowManager";
import { FileIcon } from "./FileIcon";
import { MacFileEntry } from "../lib/types";
import { TextEdit } from "../apps/TextEdit";
import { Finder } from "../apps/Finder/Finder";
import { Spotlight } from "../apps/Spotlight";
import { MediaPlayer } from "../apps/MediaPlayer";
import { Terminal } from "../apps/Terminal";
import { Calculator } from "../apps/Calculator";
import { Trash } from "../apps/Trash";
import { Messages } from "../apps/Messages";
import { FaceTime } from "../apps/FaceTime";

import { useIconManager, useAsset } from "./hooks/useIconManager";

export const Desktop: React.FC = () => {
  const { wallpaper, isBooting, setBooting, setSelectedFile } =
    useSystemStore();
  const { openContextMenu } = useMenuStore();
  const { launchProcess } = useProcessStore();
  const [files, setFiles] = useState<MacFileEntry[]>([]);

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
      await fs.rename("/Users/Guest/Desktop", file.name, newName);
      console.log("fs.rename success, refreshing list...");
      const f = await fs.ls("/Users/Guest/Desktop");
      setFiles(f);
    } catch (err) {
      console.error("Failed to rename:", err);
      alert("Failed to rename: " + err);
    }
  };

  // Boot Logic
  useEffect(() => {
    const load = async () => {
      // Wait for assets to be ready
      if (!assetsReady) return;

      // Simulate minimum boot time or wait for assets
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setBooting(false);

      // Load desktop files after booting
      const f = await fs.ls("/Users/Guest/Desktop");
      setFiles(f);
    };

    if (isBooting) {
      load();
    }
  }, [isBooting, setBooting, assetsReady]);

  // --- ACTIONS ---
  const createFolder = async () => {
    const baseName = "untitled folder";
    let name = baseName;
    let counter = 2;

    // Find unique name
    while (await fs.exists(`/Users/Guest/Desktop/${name}`)) {
      name = `${baseName} ${counter}`;
      counter++;
    }

    await fs.mkdir(`/Users/Guest/Desktop/${name}`);

    // Refresh files
    const f = await fs.ls("/Users/Guest/Desktop");
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

    // App Registry
    const apps: Record<string, any> = {
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
      launchProcess(
        app.id,
        file.name,
        app.icon,
        <app.component
          initialPath="/Users/Guest/Desktop"
          initialFilename={file.name}
        />
      );
    } else {
      alert(`No application available to open .${ext} files.`);
    }
  };

  // Listen for external FS changes (e.g. from Trash Put Back)
  useEffect(() => {
    const handleRefresh = () => {
      fs.ls("/Users/Guest/Desktop").then(setFiles);
    };
    window.addEventListener("file-system-change", handleRefresh);
    return () =>
      window.removeEventListener("file-system-change", handleRefresh);
  }, []);

  const moveToBin = async (file: MacFileEntry) => {
    // Ensure trash exists
    if (!(await fs.exists("/Users/Guest/.Trash"))) {
      await fs.mkdir("/Users/Guest/.Trash");
    }

    // Read and write to move (simplification)
    // TODO: Add fs.move to FileSystem
    try {
      const content = await fs.readFile("/Users/Guest/Desktop", file.name);
      await fs.writeFile("/Users/Guest/.Trash", file.name, content);
      await fs.delete("/Users/Guest/Desktop", file.name);

      // Refresh
      const f = await fs.ls("/Users/Guest/Desktop");
      setFiles(f);
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
      { label: "Get Info", disabled: true },
      { label: "Change Wallpaper...", action: () => alert("Wallpaper Picker") },
      { separator: true },
      { label: "Sort By", submenu: [] },
      { label: "Clean Up" },
    ]);
  };

  if (isBooting)
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <span className="text-6xl mb-8"></span>
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-white animate-[loading_2s_ease-in-out_infinite]"
              style={{ width: "50%" }}
            />
          </div>
        </div>
      </div>
    );

  return (
    <main
      className="h-screen w-screen overflow-hidden relative"
      onClick={() => {
        setSelectedFile(null);
      }}
      onContextMenu={handleContextMenu} // Capture Right Click on Desktop
    >
      {/* Wallpaper Layer (z-0) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out z-0"
        style={{
          backgroundImage: `url(${wallpaperUrl || wallpaper})`,
        }}
      />

      {/* Menu Bar (z-40) */}
      <div className="relative z-40">
        <MenuBar />
      </div>

      {/* GLOBAL CONTEXT MENU LAYER (z-50) */}
      <ContextMenu />
      <Spotlight />

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
                className="pointer-events-auto flex justify-center w-[100px]"
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
                              initialPath="/Users/Guest/Desktop"
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
                                  initialPath="/Users/Guest/Desktop"
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
                                <Terminal initialPath="/Users/Guest/Desktop" />
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
