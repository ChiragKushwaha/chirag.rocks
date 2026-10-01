import { ComponentType } from "react";
import { MacFileEntry } from "../../lib/types";

export interface AppDefinition {
  id: string;
  name: string;
  icon: string | ((props: { className?: string }) => React.JSX.Element);
  component: ComponentType<{
    initialPath?: string;
    initialFilename?: string;
  }>;
  windowConfig?: {
    width: number;
    height: number;
    x?: number;
    y?: number;
    resizable?: boolean;
  };
}

export interface SelectionBoxState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isVisible: boolean;
}

export interface DesktopIconsProps {
  files: MacFileEntry[];
  desktopPath: string;
  selectedFiles: string[];
  onSelectFile: (name: string, multiSelect: boolean) => void;
  onOpenFile: (file: MacFileEntry) => void;
  onDeleteFile: (file: MacFileEntry) => void;
  onRenameFile: (file: MacFileEntry, newName: string) => void;
  onRefresh: () => void;
}
