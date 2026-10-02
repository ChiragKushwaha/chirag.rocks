import { useCallback } from "react";
import html2canvas from "html2canvas-pro";
import { useProcessStore } from "../../store/processStore";

/**
 * Captures a thumbnail screenshot of a window element before minimizing.
 * Uses html2canvas-pro for accurate rendering of window content.
 */
export function useWindowThumbnail() {
  const { setThumbnail, minimizeProcess } = useProcessStore();

  const captureAndMinimize = useCallback(
    async (pid: number, windowEl: HTMLElement | null) => {
      if (!windowEl) {
        minimizeProcess(pid);
        return;
      }

      try {
        const canvas = await html2canvas(windowEl, {
          scale: 0.25,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          ignoreElements: (el) =>
            el.classList?.contains("cursor-se-resize") ||
            el.classList?.contains("cursor-ns-resize") ||
            el.classList?.contains("cursor-ew-resize") ||
            el.classList?.contains("cursor-nw-resize") ||
            el.classList?.contains("cursor-ne-resize") ||
            el.classList?.contains("cursor-sw-resize"),
        });
        const dataUrl = canvas.toDataURL("image/webp", 0.7);
        setThumbnail(pid, dataUrl);
      } catch (err) {
        console.warn("[useWindowThumbnail] Could not capture window thumbnail:", err);
      }

      minimizeProcess(pid);
    },
    [setThumbnail, minimizeProcess]
  );

  return captureAndMinimize;
}
