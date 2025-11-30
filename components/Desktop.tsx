import React, { useEffect, useState } from "react";
import { fs } from "../lib/FileSystem";
import { useSystemStore } from "../store/systemStore";
import { useMenuStore } from "../store/menuStore"; // New
import { useProcessStore } from "../store/processStore"; // New

import { ContextMenu } from "./Menus"; // New
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { WindowManager } from "./WindowManager";
import { FileIcon } from "./FileIcon";
import { MacFileEntry } from "../lib/types";
import { TextEdit } from "../apps/TextEdit";
import { Spotlight } from "../apps/Spotlight";

import { useIconManager, useAsset } from "./hooks/useIconManager"; // New

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
      {/* Wallpaper Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${wallpaperUrl || wallpaper})`, // Fallback to store path (which might be local public path if not in OPFS yet)
        }}
      />
      <MenuBar />

      {/* GLOBAL CONTEXT MENU LAYER */}
      <ContextMenu />
      <Spotlight />
      {/* Desktop Icons */}
      <div className="pt-10 px-2 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-2 content-start justify-start h-full pb-20">
        {files.map(
          (file) =>
            !file.isHidden && (
              <div
                key={file.name}
                onContextMenu={(e) => {
                  e.stopPropagation(); // Stop desktop menu from appearing
                  e.preventDefault();
                  // File Specific Menu
                  openContextMenu(e.clientX, e.clientY, [
                    {
                      label: "Open",
                      action: () => {
                        if (file.name.endsWith(".txt")) {
                          launchProcess(
                            "textedit",
                            file.name,
                            "📝",
                            <TextEdit
                              initialPath="/Users/Guest/Desktop"
                              initialFilename={file.name}
                            />
                          );
                        }
                      },
                    },
                    { label: "Move to Bin", danger: true },
                    { separator: true },
                    { label: "Get Info" },
                    { label: "Rename" },
                  ]);
                }}
              >
                <FileIcon name={file.name} kind={file.kind} />
              </div>
            )
        )}
      </div>

      <WindowManager />
      <Dock />
    </main>
  );
};
