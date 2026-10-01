import { useState, useCallback, RefObject } from "react";
import { SelectionBoxState } from "./types";
import { MacFileEntry } from "../../lib/types";

export function useDesktopSelection(
  files: MacFileEntry[],
  fileRefs: RefObject<Map<string, HTMLDivElement>>,
  setSelectedFiles: (files: string[]) => void
) {
  const [selectionBox, setSelectionBox] = useState<SelectionBoxState | null>(null);

  const startSelection = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      if (e.touches.length !== 2) return;
    } else {
      if (e.button !== 0) return;
    }

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setSelectionBox({
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      isVisible: true,
    });
  }, []);

  const updateSelection = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!selectionBox?.isVisible) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      setSelectionBox((prev) => (prev ? { ...prev, currentX: clientX, currentY: clientY } : null));

      const boxLeft = Math.min(selectionBox.startX, clientX);
      const boxRight = Math.max(selectionBox.startX, clientX);
      const boxTop = Math.min(selectionBox.startY, clientY);
      const boxBottom = Math.max(selectionBox.startY, clientY);

      const newlySelected: string[] = [];
      fileRefs.current?.forEach((el, name) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const intersects =
          rect.left < boxRight &&
          rect.right > boxLeft &&
          rect.top < boxBottom &&
          rect.bottom > boxTop;

        if (intersects) newlySelected.push(name);
      });

      setSelectedFiles(newlySelected);
    },
    [selectionBox, fileRefs, setSelectedFiles]
  );

  const endSelection = useCallback(() => {
    if (selectionBox?.isVisible) {
      setSelectionBox(null);
    }
  }, [selectionBox]);

  return {
    selectionBox,
    startSelection,
    updateSelection,
    endSelection,
  };
}
