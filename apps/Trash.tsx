import React, { useEffect, useState, useRef } from "react";
import { fs } from "../lib/FileSystem";
import { TrashUtils } from "../lib/TrashUtils";
import { MacFileEntry } from "../lib/types";
import { FileIcon } from "../components/FileIcon";
import { useMenuStore } from "../store/menuStore";

import { useSystemStore } from "../store/systemStore";

export const Trash: React.FC = () => {
  const [files, setFiles] = useState<MacFileEntry[]>([]);
  const { openContextMenu } = useMenuStore();
  const { user, setTrashCount } = useSystemStore();

  const userName = user?.name || "Guest";
  const trashPath = `/Users/${userName}/.Trash`;
  const desktopPath = `/Users/${userName}/Desktop`;

  // Selection State
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isVisible: boolean;
  } | null>(null);

  const fileRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const loadFiles = async () => {
    // Ensure trash directory exists
    if (!(await fs.exists(trashPath))) {
      await fs.mkdir(trashPath);
    }
    const f = await fs.ls(trashPath);
    const visibleFiles = f.filter((file) => file.name !== ".trash-info.json");
    setFiles(visibleFiles);
    setTrashCount(visibleFiles.length);
  };

  useEffect(() => {
    loadFiles();

    const handleRefresh = () => loadFiles();
    window.addEventListener("trash-updated", handleRefresh);
    return () => window.removeEventListener("trash-updated", handleRefresh);
  }, []);

  const emptyTrash = async () => {
    for (const file of files) {
      await fs.delete(trashPath, file.name);
    }
    loadFiles();
    setSelectedItems([]);
  };

  const putBack = async (items: string[]) => {
    try {
      for (const item of items) {
        const originalPath = await TrashUtils.getOriginalPath(trashPath, item);
        const targetPath = originalPath || desktopPath;

        // Ensure target directory exists
        if (!(await fs.exists(targetPath))) {
          // If original folder is gone, fallback to Desktop?
          // Or maybe try to recreate it? Let's fallback to Desktop if missing to be safe/simple for now,
          // or maybe just create it.
          // Let's try to create it if we have a path.
          if (originalPath) {
            await fs.mkdir(targetPath);
          }
        }

        await fs.move(trashPath, item, targetPath, item);
        await TrashUtils.removeFromMetadata(trashPath, item);
      }
    } catch (e) {
      console.error("Failed to put back item", e);
    }
    loadFiles();
    setSelectedItems([]);
    window.dispatchEvent(new CustomEvent("file-system-change"));
  };

  const deleteImmediately = async (items: string[]) => {
    for (const item of items) {
      await fs.delete(trashPath, item);
    }
    loadFiles();
    setSelectedItems([]);
  };

  // Drag Selection Handlers
  const handleSelectionStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
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

  const handleFileClick = (e: React.MouseEvent, file: MacFileEntry) => {
    e.stopPropagation();

    if (e.metaKey || e.ctrlKey) {
      if (selectedItems.includes(file.name)) {
        setSelectedItems(selectedItems.filter((id) => id !== file.name));
      } else {
        setSelectedItems([...selectedItems, file.name]);
        setLastSelectedId(file.name);
      }
    } else if (e.shiftKey && lastSelectedId) {
      const lastIndex = files.findIndex((f) => f.name === lastSelectedId);
      const currentIndex = files.findIndex((f) => f.name === file.name);

      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        const range = files.slice(start, end + 1).map((f) => f.name);
        setSelectedItems(range);
      }
    } else {
      setSelectedItems([file.name]);
      setLastSelectedId(file.name);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Background context menu (optional, maybe "Empty Trash")
    openContextMenu(e.clientX, e.clientY, [
      { label: "Empty Trash", action: emptyTrash, danger: true },
    ]);
  };

  const handleFileContextMenu = (e: React.MouseEvent, file: MacFileEntry) => {
    e.preventDefault();
    e.stopPropagation();

    let currentSelection = selectedItems;
    if (!selectedItems.includes(file.name)) {
      setSelectedItems([file.name]);
      setLastSelectedId(file.name);
      currentSelection = [file.name];
    }

    const count = currentSelection.length;
    const labelSuffix = count > 1 ? ` ${count} items` : "";

    openContextMenu(e.clientX, e.clientY, [
      {
        label: `Put Back${labelSuffix}`,
        action: () => putBack(currentSelection),
      },
      {
        label: `Delete Immediately${labelSuffix}`,
        action: () => deleteImmediately(currentSelection),
        danger: true,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="h-10 bg-gray-100 border-b border-gray-300 flex items-center px-4 justify-between shrink-0">
        <span className="font-semibold text-gray-700">Trash</span>
        <button
          onClick={emptyTrash}
          className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 active:bg-gray-400"
        >
          Empty
        </button>
      </div>
      <div
        ref={containerRef}
        className="flex-1 p-4 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 content-start overflow-y-auto relative"
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

        {files.length === 0 && (
          <div className="col-span-full text-center text-gray-400 mt-10 pointer-events-none">
            Trash is empty
          </div>
        )}
        {files.map((file) => (
          <div
            key={file.name}
            ref={(el) => {
              if (el) fileRefs.current.set(file.name, el);
              else fileRefs.current.delete(file.name);
            }}
            className="flex flex-col items-center group"
            onClick={(e) => handleFileClick(e, file)}
            onContextMenu={(e) => handleFileContextMenu(e, file)}
          >
            <div className="w-16 h-16 mb-1 pointer-events-none">
              <FileIcon
                name={file.name}
                kind={file.kind}
                selected={selectedItems.includes(file.name)}
              />
            </div>
            <span
              className={`text-xs text-center px-1 rounded ${
                selectedItems.includes(file.name)
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 group-hover:bg-blue-100"
              }`}
            >
              {file.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
