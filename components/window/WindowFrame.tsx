import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useProcessStore } from "../../store/processStore";
import { useMenuStore } from "../../store/menuStore";
import { Process } from "../../types/process";
import { useTranslations } from "next-intl";

interface WindowFrameProps {
  process: Process;
}

export const WindowFrame: React.FC<WindowFrameProps> = React.memo(
  ({ process }) => {
    const t = useTranslations("Window");
    const {
      closeProcess,
      minimizeProcess,
      maximizeProcess,
      focusProcess,
      updateWindowPosition,
      resizeProcess,
      snapWindow,
    } = useProcessStore();

    const { openContextMenu, closeContextMenu } = useMenuStore();
    const windowRef = useRef<HTMLDivElement>(null);

    // State
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeState, setResizeState] = useState<{
      dir: string;
      startX: number;
      startY: number;
      startWidth: number;
      startHeight: number;
      startLeft: number;
      startTop: number;
    } | null>(null);

    const [showSnapMenu, setShowSnapMenu] = useState(false);
    const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Start Drag (Generic)
    const startDrag = (
      e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
    ) => {
      // Get position
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const target = e.target as HTMLElement;

      // Stop propagation?
      e.stopPropagation();
      closeContextMenu();
      focusProcess(process.pid);

      if (target.closest(".window-titlebar") && !target.closest(".no-drag")) {
        // e.preventDefault(); // Prevent scrolling on touch
        setIsDragging(true);
        setDragOffset({
          x: clientX - process.dimension.x,
          y: clientY - process.dimension.y,
        });
      }
    };

    // Resize Start (Generic)
    const startResize = (
      e: React.MouseEvent | React.TouchEvent,
      dir: string
    ) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      // e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setResizeState({
        dir,
        startX: clientX,
        startY: clientY,
        startWidth: process.dimension.width,
        startHeight: process.dimension.height,
        startLeft: process.dimension.x,
        startTop: process.dimension.y,
      });
    };

    useEffect(() => {
      const handleMove = (e: MouseEvent | TouchEvent) => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        if (isDragging && windowRef.current) {
          // Prevent scroll on mobile while dragging
          if (e.cancelable) e.preventDefault();

          const newX = clientX - dragOffset.x;
          const newY = clientY - dragOffset.y;
          windowRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        }

        if (isResizing && resizeState) {
          if (e.cancelable) e.preventDefault();

          let newWidth = resizeState.startWidth;
          let newHeight = resizeState.startHeight;
          let newX = resizeState.startLeft;
          let newY = resizeState.startTop;
          const deltaX = clientX - resizeState.startX;
          const deltaY = clientY - resizeState.startY;

          if (resizeState.dir.includes("e")) newWidth += deltaX;
          if (resizeState.dir.includes("w")) {
            newWidth -= deltaX;
            newX += deltaX;
          }
          if (resizeState.dir.includes("s")) newHeight += deltaY;
          if (resizeState.dir.includes("n")) {
            newHeight -= deltaY;
            newY += deltaY;
          }

          if (newWidth < 300) newWidth = 300;
          if (newHeight < 200) newHeight = 200;

          resizeProcess(process.pid, newWidth, newHeight, newX, newY);
        }
      };

      const handleEnd = (e: MouseEvent | TouchEvent) => {
        // Touchend keeps clientX/Y in changedTouches? Or just use last known?
        // For 'mouseup' we have clientX/Y. For 'touchend', we don't have new coords usually needed for final commit if we used them?
        // IsDragging relies on dragOffset which is constant.
        // But updateWindowPosition needs generic "final" coords.
        // Actually we can just track the LAST move position?
        // Or just use the current style transform?

        // Easier: For dragging, we calculate final pos based on last known clientX?
        // Wait, 'touchend' doesn't provide clientX of the lifted finger in touches list. It's in changedTouches.

        let clientX = 0;
        let clientY = 0;

        if ("changedTouches" in e) {
          clientX = e.changedTouches[0].clientX;
          clientY = e.changedTouches[0].clientY;
        } else {
          clientX = (e as MouseEvent).clientX;
          clientY = (e as MouseEvent).clientY;
        }

        if (isDragging) {
          setIsDragging(false);
          updateWindowPosition(
            process.pid,
            clientX - dragOffset.x,
            clientY - dragOffset.y
          );
          if (windowRef.current) {
            windowRef.current.style.transform = "";
          }
        }
        setIsResizing(false);
      };

      if (isDragging || isResizing) {
        window.addEventListener("mousemove", handleMove, { passive: false });
        window.addEventListener("mouseup", handleEnd);
        window.addEventListener("touchmove", handleMove, { passive: false });
        window.addEventListener("touchend", handleEnd);
      }

      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleEnd);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleEnd);
      };
    }, [
      isDragging,
      isResizing,
      dragOffset,
      resizeState,
      process.pid,
      updateWindowPosition,
      resizeProcess,
    ]);

    // Context Menu
    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      openContextMenu(e.clientX, e.clientY, [
        {
          label: process.title,
          disabled: true,
        },
        { separator: true },
        {
          label: t("Minimize"),
          action: () => minimizeProcess(process.pid),
        },
        {
          label: process.isMaximized ? t("Restore") : t("Maximize"),
          action: () => maximizeProcess(process.pid),
        },
        { separator: true },
        {
          label: t("Close"),
          action: () => closeProcess(process.pid),
          danger: true,
        },
      ]);
    };

    const [minimizedCoords, setMinimizedCoords] = useState<{
      x: number;
      y: number;
    } | null>(null);

    // Use useLayoutEffect to ensure coordinates are ready before first paint
    useLayoutEffect(() => {
      if (process.isMinimizing || process.isRestoring) {
        const dockItem = document.getElementById(
          `dock-minimized-${process.pid}`
        );
        if (dockItem) {
          const rect = dockItem.getBoundingClientRect();
          const targetX = rect.x + rect.width / 2 - process.dimension.width / 2;
          const targetY =
            rect.y + rect.height / 2 - process.dimension.height / 2;
          // Set immediately without RAF to prevent frame 1 jitter
          // eslint-disable-next-line
          setMinimizedCoords({ x: targetX, y: targetY });
        }
      }
    }, [
      process.isMinimizing,
      process.isRestoring,
      process.pid,
      process.dimension,
    ]);

    // Fallback if coords not yet found (shouldn't happen often due to layout effect)
    const targetX = minimizedCoords?.x ?? window.innerWidth / 2;
    const targetY = minimizedCoords?.y ?? window.innerHeight;

    return (
      <div
        ref={windowRef}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onContextMenu={handleContextMenu}
        style={{
          transform: process.isMinimizing
            ? `translate(${targetX}px, ${targetY}px) scale(0.1)`
            : `translate(${process.dimension.x}px, ${process.dimension.y}px)`,
          width: process.isMaximized ? "100vw" : process.dimension.width,
          height: process.isMaximized
            ? "calc(100vh - 2rem)"
            : process.dimension.height,
          zIndex: process.zIndex,
          willChange:
            isDragging ||
            isResizing ||
            process.isMinimizing ||
            process.isRestoring
              ? "transform, opacity"
              : "auto",
          display: process.isMinimized ? "none" : "flex",
          opacity: process.isMinimizing ? 0.5 : 1,
          clipPath: process.isMinimizing
            ? "polygon(0 0, 100% 0, 55% 100%, 45% 100%)"
            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          borderRadius: process.isMinimizing ? "0 0 50% 50%" : "12px",
          transition: process.isMinimizing
            ? "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
            : "none",
          // @ts-expect-error - Interactable is not typed correctly with React ref
          "--restore-from-x": `${targetX}px`,
          "--restore-from-y": `${targetY}px`,
          "--restore-to-x": `${process.dimension.x}px`,
          "--restore-to-y": `${process.dimension.y}px`,
        }}
        className={`
        window absolute top-0 left-0 flex flex-col pointer-events-auto
        transition-shadow duration-200
        ${
          process.isRestoring
            ? "animate-restore-window"
            : !process.isMinimizing && !process.isClosing
            ? "animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
            : ""
        }
        ${
          process.isClosing
            ? "animate-out fade-out zoom-out-95 duration-200 ease-in fill-mode-forwards"
            : ""
        }
        ${
          process.isClosing
            ? "animate-out fade-out zoom-out-95 duration-200 ease-in fill-mode-forwards"
            : ""
        }
        ${
          process.isMaximized
            ? "transform-none! top-8! left-0! right-0! bottom-0! rounded-none! border-0"
            : "rounded-xl overflow-hidden border border-black/10 dark:border-white/10"
        }
        ${
          process.isFocused
            ? "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]"
            : "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] opacity-95"
        }
        ${
          isDragging ||
          isResizing ||
          process.isMinimizing ||
          process.isRestoring
            ? "backdrop-blur-none shadow-none"
            : "backdrop-blur-[50px] backdrop-saturate-150"
        }
        bg-white/85 dark:bg-[#1e1e1e]/85
      `}
      >
        {/* --- RESIZE HANDLES (Invisible but clickable) --- */}
        {!process.isMaximized && process.dimension.resizable !== false && (
          <>
            <div
              onMouseDown={(e) => startResize(e, "n")}
              onTouchStart={(e) => startResize(e, "n")}
              className="no-drag absolute top-0 left-0 w-full h-1 cursor-ns-resize z-50"
            />
            <div
              onMouseDown={(e) => startResize(e, "s")}
              onTouchStart={(e) => startResize(e, "s")}
              className="no-drag absolute bottom-0 left-0 w-full h-1 cursor-ns-resize z-50"
            />
            <div
              onMouseDown={(e) => startResize(e, "e")}
              onTouchStart={(e) => startResize(e, "e")}
              className="no-drag absolute top-0 right-0 w-1 h-full cursor-ew-resize z-50"
            />
            <div
              onMouseDown={(e) => startResize(e, "w")}
              onTouchStart={(e) => startResize(e, "w")}
              className="no-drag absolute top-0 left-0 w-1 h-full cursor-ew-resize z-50"
            />

            <div
              onMouseDown={(e) => startResize(e, "ne")}
              onTouchStart={(e) => startResize(e, "ne")}
              className="no-drag absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-50"
            />
            <div
              onMouseDown={(e) => startResize(e, "nw")}
              onTouchStart={(e) => startResize(e, "nw")}
              className="no-drag absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-50"
            />
            <div
              onMouseDown={(e) => startResize(e, "se")}
              onTouchStart={(e) => startResize(e, "se")}
              className="no-drag absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-50"
            />
            <div
              onMouseDown={(e) => startResize(e, "sw")}
              onTouchStart={(e) => startResize(e, "sw")}
              className="no-drag absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50"
            />
          </>
        )}

        {/* --- TITLE BAR --- */}
        <div
          className="window-titlebar h-10 bg-linear-to-b from-white/10 to-transparent border-b border-black/10 flex items-center px-4 cursor-default select-none shrink-0"
          onDoubleClick={() => maximizeProcess(process.pid)} // Double click titlebar to maximize
        >
          {/* Traffic Lights */}
          <div className="flex space-x-2 group relative no-drag">
            {/* Close */}
            <button
              onClick={() => closeProcess(process.pid)}
              className="w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-75 flex items-center justify-center text-[8px] text-black/50 opacity-100 shadow-sm border border-[#E0443E]"
            >
              <span className="hidden group-hover:block">x</span>
            </button>

            {/* Minimize */}
            <button
              onClick={() => minimizeProcess(process.pid)}
              className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-75 flex items-center justify-center text-[8px] text-black/50 opacity-100 shadow-sm border border-[#DEA123]"
            >
              <span className="hidden group-hover:block">-</span>
            </button>

            {/* Maximize / Split Screen Trigger */}
            <div
              className="relative"
              onMouseEnter={() => {
                snapTimeoutRef.current = setTimeout(
                  () => setShowSnapMenu(true),
                  600
                );
              }}
              onMouseLeave={() => {
                if (snapTimeoutRef.current)
                  clearTimeout(snapTimeoutRef.current);
                // Small delay to allow moving mouse to the menu
                setTimeout(() => {
                  // Check if we are actually hovering the menu (handled by menu mouse events)
                  // For simplicity in this demo, we just close it quickly if mouse leaves button
                  // In a real robust app, we'd check refs.
                }, 200);
              }}
            >
              <button
                onClick={() => maximizeProcess(process.pid)}
                className="w-3 h-3 rounded-full bg-[#27C93F] hover:brightness-75 flex items-center justify-center text-[8px] text-black/50 opacity-100 shadow-sm border border-[#1AAB29]"
              >
                <span className="hidden group-hover:block">+</span>
              </button>

              {/* Split Screen Menu (MacOS Style) */}
              {showSnapMenu && (
                <div
                  className="absolute top-5 left-0 w-40 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 py-1 flex flex-col z-100 animate-in fade-in zoom-in-95 duration-100"
                  onMouseEnter={() => {
                    if (snapTimeoutRef.current)
                      clearTimeout(snapTimeoutRef.current);
                  }}
                  onMouseLeave={() => setShowSnapMenu(false)}
                >
                  <div className="px-2 py-1 text-[10px] text-gray-500 font-semibold border-b border-gray-200/50 mb-1">
                    {t("MoveTo")}
                  </div>
                  <button
                    className="px-3 py-1.5 text-xs text-left hover:bg-blue-500 hover:text-white flex items-center gap-2"
                    onClick={() => {
                      snapWindow(process.pid, "left");
                      setShowSnapMenu(false);
                    }}
                  >
                    <div className="w-3 h-2 border border-current rounded-[1px] bg-linear-to-r from-current to-transparent to-50%" />
                    {t("LeftSide")}
                  </button>
                  <button
                    className="px-3 py-1.5 text-xs text-left hover:bg-blue-500 hover:text-white flex items-center gap-2"
                    onClick={() => {
                      snapWindow(process.pid, "right");
                      setShowSnapMenu(false);
                    }}
                  >
                    <div className="w-3 h-2 border border-current rounded-[1px] bg-linear-to-l from-current to-transparent to-50%" />
                    {t("RightSide")}
                  </button>
                  <button
                    className="px-3 py-1.5 text-xs text-left hover:bg-blue-500 hover:text-white flex items-center gap-2"
                    onClick={() => {
                      maximizeProcess(process.pid);
                      setShowSnapMenu(false);
                    }}
                  >
                    <div className="w-3 h-2 border border-current rounded-[1px] bg-current" />
                    {t("EnterFullScreen")}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Window Title */}
          <div className="flex-1 text-center text-[13px] font-medium text-gray-400/90 pointer-events-none">
            {process.title}
          </div>

          {/* Spacer */}
          <div className="w-14" />
        </div>

        {/* App Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {process.component}
        </div>
      </div>
    );
  }
);

WindowFrame.displayName = "WindowFrame";
