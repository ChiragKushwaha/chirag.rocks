import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useProcessStore } from "../../store/processStore";
import { useMenuStore } from "../../store/menuStore";
import { Process } from "../../types/process";
import { useTranslations } from "next-intl";
import { useWindowThumbnail } from "../hooks/useWindowThumbnail";

interface WindowFrameProps {
  process: Process;
}

export const WindowFrame: React.FC<WindowFrameProps> = React.memo(
  ({ process }) => {
    const t = useTranslations("Window");
    const {
      closeProcess,
      maximizeProcess,
      focusProcess,
      updateWindowPosition,
      resizeProcess,
      snapWindow,
    } = useProcessStore();

    const captureAndMinimize = useWindowThumbnail();
    const { openContextMenu, closeContextMenu } = useMenuStore();
    const windowRef = useRef<HTMLDivElement>(null);

    // State
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isOpening, setIsOpening] = useState(true);
    const [showSnapMenu, setShowSnapMenu] = useState(false);
    const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const dragRef = useRef<{
      startX: number;
      startY: number;
      clientX: number;
      clientY: number;
      lastClientX: number;
      lastClientY: number;
      hasMoved: boolean;
    } | null>(null);

    const resizeRef = useRef<{
      dir: string;
      startX: number;
      startY: number;
      startWidth: number;
      startHeight: number;
      startLeft: number;
      startTop: number;
      lastWidth: number;
      lastHeight: number;
      lastX: number;
      lastY: number;
      hasMoved: boolean;
    } | null>(null);

    // Start Drag
    const startDrag = (
      e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
    ) => {
      if (process.isMaximized) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (clientX === 0 && clientY === 0) return;

      const target = e.target as HTMLElement;

      e.stopPropagation();
      closeContextMenu();
      focusProcess(process.pid);

      // Allow dragging if clicked on window titlebar or custom drag handles
      const isHeader =
        Boolean(target.closest(".window-titlebar")) ||
        Boolean(target.closest(".window-drag-handle"));

      // Do NOT start window drag if user clicked on interactive elements
      const isInteractive =
        Boolean(target.closest(".no-drag")) ||
        Boolean(target.closest("button")) ||
        Boolean(target.closest("input")) ||
        Boolean(target.closest("textarea")) ||
        Boolean(target.closest("select")) ||
        Boolean(target.closest("a"));

      if (isHeader && !isInteractive) {
        setIsDragging(true);
        dragRef.current = {
          startX: process.dimension.x,
          startY: process.dimension.y,
          clientX,
          clientY,
          lastClientX: clientX,
          lastClientY: clientY,
          hasMoved: false,
        };
      }
    };

    // Start Resize
    const startResize = (
      e: React.MouseEvent | React.TouchEvent,
      dir: string
    ) => {
      if (process.isMaximized || process.dimension.resizable === false) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      e.stopPropagation();
      closeContextMenu();
      focusProcess(process.pid);
      setIsResizing(true);

      resizeRef.current = {
        dir,
        startX: clientX,
        startY: clientY,
        startWidth: process.dimension.width,
        startHeight: process.dimension.height,
        startLeft: process.dimension.x,
        startTop: process.dimension.y,
        lastWidth: process.dimension.width,
        lastHeight: process.dimension.height,
        lastX: process.dimension.x,
        lastY: process.dimension.y,
        hasMoved: false,
      };
    };

    useEffect(() => {
      const handleMove = (e: MouseEvent | TouchEvent) => {
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        if (clientX === 0 && clientY === 0) return;

        // --- DRAG LOGIC ---
        if (isDragging && windowRef.current && dragRef.current) {
          if (e.cancelable) e.preventDefault();

          const deltaX = clientX - dragRef.current.clientX;
          const deltaY = clientY - dragRef.current.clientY;

          if (!dragRef.current.hasMoved) {
            if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
              dragRef.current.hasMoved = true;
            }
          }

          if (dragRef.current.hasMoved) {
            const newX = dragRef.current.startX + deltaX;
            // Safe area: cannot go above menu bar (y = 0 in container)
            const newY = Math.max(0, dragRef.current.startY + deltaY);
            windowRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
            windowRef.current.style.setProperty("--restore-to-x", `${newX}px`);
            windowRef.current.style.setProperty("--restore-to-y", `${newY}px`);
            dragRef.current.lastClientX = clientX;
            dragRef.current.lastClientY = clientY;
          }
        }

        // --- RESIZE LOGIC ---
        if (isResizing && windowRef.current && resizeRef.current) {
          if (e.cancelable) e.preventDefault();

          const r = resizeRef.current;
          const deltaX = clientX - r.startX;
          const deltaY = clientY - r.startY;

          let newWidth = r.startWidth;
          let newHeight = r.startHeight;
          let newX = r.startLeft;
          let newY = r.startTop;

          if (r.dir.includes("e")) {
            newWidth = Math.max(300, r.startWidth + deltaX);
          }
          if (r.dir.includes("w")) {
            const rawWidth = r.startWidth - deltaX;
            newWidth = Math.max(300, rawWidth);
            newX = r.startLeft + (r.startWidth - newWidth);
          }
          if (r.dir.includes("s")) {
            newHeight = Math.max(200, r.startHeight + deltaY);
          }
          if (r.dir.includes("n")) {
            const rawHeight = r.startHeight - deltaY;
            const maxHeight = r.startTop + r.startHeight; // Cannot go above top: 0
            newHeight = Math.max(200, Math.min(rawHeight, maxHeight));
            newY = Math.max(0, r.startTop + (r.startHeight - newHeight));
          }

          windowRef.current.style.width = `${newWidth}px`;
          windowRef.current.style.height = `${newHeight}px`;
          windowRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
          windowRef.current.style.setProperty("--restore-to-x", `${newX}px`);
          windowRef.current.style.setProperty("--restore-to-y", `${newY}px`);

          r.lastWidth = newWidth;
          r.lastHeight = newHeight;
          r.lastX = newX;
          r.lastY = newY;
          r.hasMoved = true;
        }
      };

      const handleEnd = (e: MouseEvent | TouchEvent) => {
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
          if (dragRef.current && dragRef.current.hasMoved) {
            const finalClientX =
              clientX === 0 && clientY === 0
                ? dragRef.current.lastClientX
                : clientX;
            const finalClientY =
              clientX === 0 && clientY === 0
                ? dragRef.current.lastClientY
                : clientY;

            const deltaX = finalClientX - dragRef.current.clientX;
            const deltaY = finalClientY - dragRef.current.clientY;
            const finalX = dragRef.current.startX + deltaX;
            const finalY = Math.max(0, dragRef.current.startY + deltaY);
            updateWindowPosition(process.pid, finalX, finalY);
          }
          dragRef.current = null;
        }

        if (isResizing) {
          setIsResizing(false);
          if (resizeRef.current && resizeRef.current.hasMoved) {
            resizeProcess(
              process.pid,
              resizeRef.current.lastWidth,
              resizeRef.current.lastHeight,
              resizeRef.current.lastX,
              resizeRef.current.lastY
            );
          }
          resizeRef.current = null;
        }
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
        { type: "separator" },
        {
          label: t("Close"),
          action: () => closeProcess(process.pid),
          shortcut: "⌘W",
        },
        {
          label: t("Minimize"),
          action: () => captureAndMinimize(process.pid, windowRef.current),
          shortcut: "⌘M",
        },
        {
          label: process.isMaximized ? t("ExitFullScreen") : t("Zoom"),
          action: () => maximizeProcess(process.pid),
        },
      ]);
    };

    const [minimizedCoords, setMinimizedCoords] = useState<{
      x: number;
      y: number;
    } | null>(null);

    // Calculate minimized dock target coords
    useLayoutEffect(() => {
      if (process.isMinimizing || process.isRestoring) {
        const dockItem = document.getElementById(
          `dock-minimized-${process.pid}`
        );
        if (dockItem) {
          const rect = dockItem.getBoundingClientRect();
          const MENU_BAR_HEIGHT = 30;
          const targetX = rect.x + rect.width / 2 - process.dimension.width / 2;
          const targetY =
            rect.y - MENU_BAR_HEIGHT + rect.height / 2 - process.dimension.height / 2;
          setMinimizedCoords({ x: targetX, y: targetY });
        }
      }
    }, [
      process.isMinimizing,
      process.isRestoring,
      process.pid,
      process.dimension,
    ]);

    // Fallback if coords not yet found
    const targetX = minimizedCoords?.x ?? window.innerWidth / 2;
    const targetY = minimizedCoords?.y ?? (window.innerHeight - 30);

    return (
      <div
        ref={windowRef}
        id={`process-${process.pid}`}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onContextMenu={handleContextMenu}
        onAnimationEnd={() => {
          if (isOpening) setIsOpening(false);
        }}
        style={{
          transform: process.isMaximized
            ? "none"
            : process.isMinimizing
              ? `translate(${targetX}px, ${targetY}px) scale(0.1)`
              : `translate(${process.dimension.x}px, ${process.dimension.y}px)`,
          width: process.isMaximized ? "100vw" : process.dimension.width,
          height: process.isMaximized
            ? "100%"
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
          borderRadius: process.isMaximized
            ? "0px"
            : process.isMinimizing
              ? "0 0 50% 50%"
              : "12px",
          border: process.isMaximized ? "0px" : undefined,
          top: process.isMaximized ? "0" : undefined,
          left: process.isMaximized ? "0" : undefined,
          transition: process.isMinimizing
            ? "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
            : "none",
          // @ts-expect-error - Custom CSS properties for animation keyframes
          "--restore-from-x": `${targetX}px`,
          "--restore-from-y": `${targetY}px`,
          "--restore-to-x": `${process.dimension.x}px`,
          "--restore-to-y": `${process.dimension.y}px`,
        }}
        className={`
        window window-frame absolute top-0 left-0 flex flex-col pointer-events-auto
        transition-shadow duration-200
        ${process.isRestoring
            ? "animate-restore-window"
            : isOpening && !process.isMinimizing && !process.isClosing
              ? "animate-window-open"
              : ""
          }
        ${process.isClosing
            ? "animate-window-close"
            : ""
          }
        ${process.isMaximized
            ? "transform-none! top-0! left-0! right-0! bottom-0! rounded-none! border-0"
            : "rounded-xl overflow-hidden border border-black/10 dark:border-white/10"
          }
        ${process.isFocused
            ? "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]"
            : "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] opacity-95"
          }
        ${isDragging ||
            isResizing ||
            process.isMinimizing ||
            process.isRestoring
            ? "backdrop-blur-none shadow-none"
            : "backdrop-blur-[50px] backdrop-saturate-150"
          }
        bg-white/85 dark:bg-[#1e1e1e]/85
      `}
      >
        {/* --- RESIZE HANDLES (Generous hit zones) --- */}
        {!process.isMaximized && process.dimension.resizable !== false && (
          <>
            {/* North Edge */}
            <div
              onMouseDown={(e) => startResize(e, "n")}
              onTouchStart={(e) => startResize(e, "n")}
              className="no-drag absolute top-0 left-6 right-6 h-2 cursor-ns-resize z-40"
            />
            {/* South Edge */}
            <div
              onMouseDown={(e) => startResize(e, "s")}
              onTouchStart={(e) => startResize(e, "s")}
              className="no-drag absolute -bottom-1 left-6 right-6 h-3 cursor-ns-resize z-40"
            />
            {/* East Edge */}
            <div
              onMouseDown={(e) => startResize(e, "e")}
              onTouchStart={(e) => startResize(e, "e")}
              className="no-drag absolute -right-1 top-6 bottom-6 w-3 cursor-ew-resize z-40"
            />
            {/* West Edge */}
            <div
              onMouseDown={(e) => startResize(e, "w")}
              onTouchStart={(e) => startResize(e, "w")}
              className="no-drag absolute -left-1 top-6 bottom-6 w-3 cursor-ew-resize z-40"
            />

            {/* North-East Corner */}
            <div
              onMouseDown={(e) => startResize(e, "ne")}
              onTouchStart={(e) => startResize(e, "ne")}
              className="no-drag absolute -top-1 -right-1 w-6 h-6 cursor-ne-resize z-50"
            />
            {/* North-West Corner */}
            <div
              onMouseDown={(e) => startResize(e, "nw")}
              onTouchStart={(e) => startResize(e, "nw")}
              className="no-drag absolute -top-1 -left-1 w-4 h-4 cursor-nw-resize z-50"
            />
            {/* South-East Corner */}
            <div
              onMouseDown={(e) => startResize(e, "se")}
              onTouchStart={(e) => startResize(e, "se")}
              className="no-drag absolute -bottom-1 -right-1 w-6 h-6 cursor-se-resize z-50"
            />
            {/* South-West Corner */}
            <div
              onMouseDown={(e) => startResize(e, "sw")}
              onTouchStart={(e) => startResize(e, "sw")}
              className="no-drag absolute -bottom-1 -left-1 w-6 h-6 cursor-sw-resize z-50"
            />
          </>
        )}

        {/* --- TITLE BAR --- */}
        <div
          className="window-titlebar h-10 bg-linear-to-b from-white/10 to-transparent border-b border-black/10 flex items-center px-4 cursor-default select-none shrink-0"
          onDoubleClick={() => maximizeProcess(process.pid)}
        >
          {/* Traffic Lights */}
          <div className="flex space-x-2 group relative no-drag">
            {/* Close */}
            <button
              onClick={() => closeProcess(process.pid)}
              className="w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-90 active:brightness-75 flex items-center justify-center text-[7px] font-bold text-[#4c0000] opacity-100 shadow-xs border border-[#E0443E] transition-all cursor-default"
              aria-label="Close"
            >
              <span className="hidden group-hover:block leading-none">✕</span>
            </button>

            {/* Minimize */}
            <button
              onClick={() => captureAndMinimize(process.pid, windowRef.current)}
              className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-90 active:brightness-75 flex items-center justify-center text-[7px] font-bold text-[#5a3a00] opacity-100 shadow-xs border border-[#DEA123] transition-all cursor-default"
              aria-label="Minimize"
            >
              <span className="hidden group-hover:block leading-none">−</span>
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
                setTimeout(() => {}, 200);
              }}
            >
              <button
                onClick={() => maximizeProcess(process.pid)}
                className="w-3 h-3 rounded-full bg-[#27C93F] hover:brightness-90 active:brightness-75 flex items-center justify-center text-[7px] font-bold text-[#004d00] opacity-100 shadow-xs border border-[#1AAB29] transition-all cursor-default"
                aria-label="Zoom or Fullscreen"
              >
                <span className="hidden group-hover:block leading-none">＋</span>
              </button>

              {/* Split Screen Menu (MacOS Style) */}
              {showSnapMenu && (
                <div
                  className="absolute top-5 left-0 w-44 bg-[rgba(246,246,246,0.96)] dark:bg-[rgba(40,40,40,0.96)] backdrop-blur-xl rounded-lg shadow-2xl border border-black/10 dark:border-white/10 py-1.5 flex flex-col z-100 animate-in fade-in zoom-in-95 duration-100 text-gray-800 dark:text-gray-100"
                  onMouseEnter={() => {
                    if (snapTimeoutRef.current)
                      clearTimeout(snapTimeoutRef.current);
                  }}
                  onMouseLeave={() => setShowSnapMenu(false)}
                >
                  <div className="px-3 py-1 text-[11px] text-gray-500 dark:text-gray-400 font-semibold border-b border-black/5 dark:border-white/10 mb-1 select-none">
                    {t("MoveTo")}
                  </div>
                  <button
                    className="px-3 py-1.5 text-xs text-left text-gray-800 dark:text-gray-100 hover:bg-[#007AFF] hover:text-white dark:hover:bg-[#0A84FF] dark:hover:text-white flex items-center gap-2 rounded-sm mx-1 transition-colors cursor-default"
                    onClick={() => {
                      snapWindow(process.pid, "left");
                      setShowSnapMenu(false);
                    }}
                  >
                    <div className="w-3.5 h-2.5 border border-current rounded-[1px] bg-linear-to-r from-current to-transparent to-50%" />
                    <span>{t("LeftSide")}</span>
                  </button>
                  <button
                    className="px-3 py-1.5 text-xs text-left text-gray-800 dark:text-gray-100 hover:bg-[#007AFF] hover:text-white dark:hover:bg-[#0A84FF] dark:hover:text-white flex items-center gap-2 rounded-sm mx-1 transition-colors cursor-default"
                    onClick={() => {
                      snapWindow(process.pid, "right");
                      setShowSnapMenu(false);
                    }}
                  >
                    <div className="w-3.5 h-2.5 border border-current rounded-[1px] bg-linear-to-l from-current to-transparent to-50%" />
                    <span>{t("RightSide")}</span>
                  </button>
                  <button
                    className="px-3 py-1.5 text-xs text-left text-gray-800 dark:text-gray-100 hover:bg-[#007AFF] hover:text-white dark:hover:bg-[#0A84FF] dark:hover:text-white flex items-center gap-2 rounded-sm mx-1 transition-colors cursor-default"
                    onClick={() => {
                      maximizeProcess(process.pid);
                      setShowSnapMenu(false);
                    }}
                  >
                    <div className="w-3.5 h-2.5 border border-current rounded-[1px] bg-current" />
                    <span>{t("EnterFullScreen")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Window Title */}
          <div className="flex-1 text-center text-[13px] font-medium text-gray-700 dark:text-gray-200 pointer-events-none select-none">
            {process.title}
          </div>

          {/* Spacer */}
          <div className="w-14" />
        </div>

        {/* App Content Area */}
        <div className="flex-1 overflow-hidden relative select-none">
          {process.component}
        </div>
      </div>
    );
  }
);

WindowFrame.displayName = "WindowFrame";
