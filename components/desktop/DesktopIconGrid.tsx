import React from "react";
import { DesktopIcon } from "../DesktopIcon";
import { MacFileEntry } from "../../lib/types";
import { MenuItem } from "../../store/menuStore";

interface DesktopIconGridProps {
  files: MacFileEntry[];
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  fileRefs: React.RefObject<Map<string, HTMLDivElement>>;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  dragStartPositions: React.RefObject<Map<string, { x: number; y: number }>>;
  iconPositions: Record<string, { x: number; y: number }>;
  setIconPosition: (name: string, x: number, y: number, absolute?: boolean) => void;
  renamingFile: string | null;
  setRenamingFile: (name: string | null) => void;
  handleRename: (file: MacFileEntry, newName: string) => Promise<void>;
  openFile: (file: MacFileEntry) => void;
  setSelectedFile: (file: string | null) => void;
  setLastClickId: (id: string | null) => void;
  setLastClickTime: (time: number) => void;
  lastClickId: string | null;
  lastClickTime: number;
  openContextMenu: (x: number, y: number, items: MenuItem[]) => void;
  moveToBin: (file: MacFileEntry) => Promise<void>;
}

export const DesktopIconGrid: React.FC<DesktopIconGridProps> = ({
  files,
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
}) => {
  return (
    <div
      className="pt-[34px] px-1 grid grid-flow-col grid-rows-[repeat(auto-fill,104px)] gap-y-1 gap-x-0 content-start justify-end h-full pb-20 z-10 relative pointer-events-none direction-rtl"
      style={{ direction: "rtl" }}
    >
      {files.map(
        (file) =>
          !file.isHidden && (
            <DesktopIcon
              key={file.name}
              file={file}
              files={files}
              constraintsRef={constraintsRef}
              fileRefs={fileRefs}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              dragStartPositions={dragStartPositions}
              iconPositions={iconPositions}
              setIconPosition={setIconPosition}
              renamingFile={renamingFile}
              setRenamingFile={setRenamingFile}
              handleRename={handleRename}
              openFile={openFile}
              setSelectedFile={setSelectedFile}
              setLastClickId={setLastClickId}
              setLastClickTime={setLastClickTime}
              lastClickId={lastClickId}
              lastClickTime={lastClickTime}
              openContextMenu={openContextMenu}
              moveToBin={moveToBin}
            />
          )
      )}
    </div>
  );
};
