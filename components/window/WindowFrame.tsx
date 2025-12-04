import React, { useRef, useState, useEffect } from "react";
import { useProcessStore } from "../../store/processStore";
import { useMenuStore } from "../../store/menuStore";
import { Process } from "../../types/process";

interface WindowFrameProps {
  process: Process;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ process }) => {
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

  // Focus & Drag Start
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeContextMenu();
    focusProcess(process.pid);

    const target = e.target as HTMLElement;
    // Only drag if clicking titlebar and not a no-drag element (like buttons)
    if (target.closest(".window-titlebar") && !target.closest(".no-drag")) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - process.dimension.x,
        y: e.clientY - process.dimension.y,
      });
    }
  };

  // Resize Start
  const handleResizeStart = (e: React.MouseEvent, dir: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeState({
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: process.dimension.width,
      startHeight: process.dimension.height,
      startLeft: process.dimension.x,
      startTop: process.dimension.y,
    });
  };

  // Global Mouse Move/Up Handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateWindowPosition(
          process.pid,
          e.clientX - dragOffset.x,
          e.clientY - dragOffset.y
        );
      }
      if (isResizing && resizeState) {
        let newWidth = resizeState.startWidth;
        let newHeight = resizeState.startHeight;
        let newX = resizeState.startLeft;
        let newY = resizeState.startTop;
        const deltaX = e.clientX - resizeState.startX;
        const deltaY = e.clientY - resizeState.startY;

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

        // Constraints
        if (newWidth < 300) newWidth = 300;
        if (newHeight < 200) newHeight = 200;

        resizeProcess(process.pid, newWidth, newHeight, newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
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
        label: "Minimize",
        action: () => minimizeProcess(process.pid),
      },
      {
        label: process.isMaximized ? "Restore" : "Maximize",
        action: () => maximizeProcess(process.pid),
      },
      { separator: true },
      {
        label: "Close",
        action: () => closeProcess(process.pid),
        danger: true,
      },
    ]);
  };

  return (
    <div
      ref={windowRef}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      style={{
        transform: `translate(${process.dimension.x}px, ${process.dimension.y}px)`,
        width: process.isMaximized ? "100vw" : process.dimension.width,
        height: process.isMaximized
          ? "calc(100vh - 2rem)"
          : process.dimension.height,
        zIndex: process.zIndex,
        willChange: isDragging || isResizing ? "transform" : "auto",
        display: process.isMinimized ? "none" : "flex",
      }}
      className={`
        window absolute top-0 left-0 flex flex-col pointer-events-auto
        transition-shadow duration-200
        ${
          process.isMaximized
            ? "!transform-none !top-8 !left-0 !right-0 !bottom-0 !rounded-none border-0"
            : "rounded-xl overflow-hidden border border-black/10 dark:border-white/10"
        }
        ${
          process.isFocused
            ? "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]"
            : "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] opacity-95"
        }
        bg-white/85 dark:bg-[#1e1e1e]/85 backdrop-blur-[50px] backdrop-saturate-150
      `}
    >
      {/* --- RESIZE HANDLES (Invisible but clickable) --- */}
      {!process.isMaximized && (
        <>
          <div
            onMouseDown={(e) => handleResizeStart(e, "n")}
            className="no-drag absolute top-0 left-0 w-full h-1 cursor-ns-resize z-50"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "s")}
            className="no-drag absolute bottom-0 left-0 w-full h-1 cursor-ns-resize z-50"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "e")}
            className="no-drag absolute top-0 right-0 w-1 h-full cursor-ew-resize z-50"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "w")}
            className="no-drag absolute top-0 left-0 w-1 h-full cursor-ew-resize z-50"
          />

          <div
            onMouseDown={(e) => handleResizeStart(e, "ne")}
            className="no-drag absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-50"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "nw")}
            className="no-drag absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-50"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "se")}
            className="no-drag absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-50"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "sw")}
            className="no-drag absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50"
          />
        </>
      )}

      {/* --- TITLE BAR --- */}
      <div
        className="window-titlebar h-10 bg-linear-to-b from-white/10 to-transparent border-b border-black/10 flex items-center px-4 cursor-default select-none flex-shrink-0"
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
              if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
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
                className="absolute top-5 left-0 w-40 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 py-1 flex flex-col z-[100] animate-in fade-in zoom-in-95 duration-100"
                onMouseEnter={() => {
                  if (snapTimeoutRef.current)
                    clearTimeout(snapTimeoutRef.current);
                }}
                onMouseLeave={() => setShowSnapMenu(false)}
              >
                <div className="px-2 py-1 text-[10px] text-gray-500 font-semibold border-b border-gray-200/50 mb-1">
                  Move Window to...
                </div>
                <button
                  className="px-3 py-1.5 text-xs text-left hover:bg-blue-500 hover:text-white flex items-center gap-2"
                  onClick={() => {
                    snapWindow(process.pid, "left");
                    setShowSnapMenu(false);
                  }}
                >
                  <div className="w-3 h-2 border border-current rounded-[1px] bg-linear-to-r from-current to-transparent to-50%" />
                  Left Side of Screen
                </button>
                <button
                  className="px-3 py-1.5 text-xs text-left hover:bg-blue-500 hover:text-white flex items-center gap-2"
                  onClick={() => {
                    snapWindow(process.pid, "right");
                    setShowSnapMenu(false);
                  }}
                >
                  <div className="w-3 h-2 border border-current rounded-[1px] bg-linear-to-l from-current to-transparent to-50%" />
                  Right Side of Screen
                </button>
                <button
                  className="px-3 py-1.5 text-xs text-left hover:bg-blue-500 hover:text-white flex items-center gap-2"
                  onClick={() => {
                    maximizeProcess(process.pid);
                    setShowSnapMenu(false);
                  }}
                >
                  <div className="w-3 h-2 border border-current rounded-[1px] bg-current" />
                  Enter Full Screen
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
      <div className="flex-1 overflow-hidden relative">{process.component}</div>
    </div>
  );
};
