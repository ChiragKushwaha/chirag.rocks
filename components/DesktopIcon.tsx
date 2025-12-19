import React from "react";
import { motion } from "framer-motion";
import { FileIcon } from "./FileIcon";
import { MacFileEntry } from "../lib/types";
import { MenuItem } from "../store/menuStore";

interface DesktopIconProps {
  file: MacFileEntry;
  files: MacFileEntry[];
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  fileRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  dragStartPositions: React.MutableRefObject<
    Map<string, { x: number; y: number }>
  >;
  iconPositions: Record<string, { x: number; y: number; absolute?: boolean }>;
  setIconPosition: (
    name: string,
    x: number,
    y: number,
    absolute?: boolean
  ) => void;
  renamingFile: string | null;
  setRenamingFile: (name: string | null) => void;
  handleRename: (file: MacFileEntry, newName: string) => void;
  openFile: (file: MacFileEntry) => void;
  setSelectedFile: (name: string) => void;
  setLastClickId: (id: string | null) => void;
  setLastClickTime: (time: number) => void;
  lastClickId: string | null;
  lastClickTime: number;
  openContextMenu: (x: number, y: number, items: MenuItem[]) => void;
  moveToBin: (file: MacFileEntry) => Promise<void>;
}

export const DesktopIcon = React.memo(
  ({
    file,
    constraintsRef,
    fileRefs,
    selectedFiles,
    setSelectedFiles,
    dragStartPositions,
    iconPositions,
    setIconPosition,
    renamingFile,
    setRenamingFile,
    handleRename,
    openFile,
    setSelectedFile,
    setLastClickId,
    setLastClickTime,
    lastClickId,
    lastClickTime,
    openContextMenu,
    moveToBin,
    files,
  }: DesktopIconProps) => {
    return (
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
          dragStartPositions.current.clear();

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
              const el = fileRefs.current.get(name);
              if (el) {
                const currentX = startPos.x;
                const currentY = startPos.y;

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
            const startPos = dragStartPositions.current.get(name);
            if (!startPos) return;

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
        }}
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
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            const now = Date.now();
            if (lastClickId === file.name && now - lastClickTime < 300) {
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
          onContextMenu={(e: React.MouseEvent) => {
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
                      const f = files.find((file) => file.name === name);
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
                      const f = files.find((file) => file.name === name);
                      if (f) await moveToBin(f);
                    }
                  },
                },
              ]);
            } else {
              // Single-select Context Menu
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
    );
  }
);

DesktopIcon.displayName = "DesktopIcon";
