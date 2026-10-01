import React from "react";
import { SelectionBoxState } from "./types";

interface DesktopSelectionBoxProps {
  selectionBox: SelectionBoxState | null;
}

export const DesktopSelectionBox: React.FC<DesktopSelectionBoxProps> = ({
  selectionBox,
}) => {
  if (!selectionBox || !selectionBox.isVisible) return null;

  const left = Math.min(selectionBox.startX, selectionBox.currentX);
  const top = Math.min(selectionBox.startY, selectionBox.currentY);
  const width = Math.abs(selectionBox.currentX - selectionBox.startX);
  const height = Math.abs(selectionBox.currentY - selectionBox.startY);

  return (
    <div
      className="absolute border border-blue-500/50 bg-blue-500/20 backdrop-blur-xs rounded-xs pointer-events-none z-30"
      style={{ left, top, width, height }}
    />
  );
};
