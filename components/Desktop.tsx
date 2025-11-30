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

export const Desktop: React.FC = () => {
  const { wallpaper, isBooting, setBooting, setSelectedFile } =
    useSystemStore();
  const { openContextMenu } = useMenuStore();
  const { launchProcess } = useProcessStore();
  const [files, setFiles] = useState<MacFileEntry[]>([]);

  // ... (Keep existing boot logic) ...
  useEffect(() => {
    const load = async () => {
      if (isBooting) {
        await new Promise((r) => setTimeout(r, 2000));
        setBooting(false);
      }
      const f = await fs.ls("/Users/Guest/Desktop");
      setFiles(f);
    };
    load();
  }, [isBooting]);

  // --- RIGHT CLICK HANDLER ---
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      { label: "New Folder", action: () => alert("New Folder logic here") },
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
      className="h-screen w-screen bg-cover bg-center overflow-hidden relative"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onClick={() => {
        setSelectedFile(null);
      }}
      onContextMenu={handleContextMenu} // Capture Right Click on Desktop
    >
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
