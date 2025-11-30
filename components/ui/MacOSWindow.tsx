import React, { useState, useRef, useEffect } from "react";
import { MacOSTrafficLights } from "./MacOSTrafficLights";

interface MacOSWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  resizable?: boolean;
}

export const MacOSWindow: React.FC<MacOSWindowProps> = ({
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  minSize = { width: 300, height: 200 },
  resizable = true,
  className = "",
  style,
  ...props
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if clicking the title bar (and not buttons)
    if ((e.target as HTMLElement).closest(".traffic-lights")) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-[var(--window-background)] backdrop-blur-xl rounded-xl border border-[var(--separator)] shadow-2xl overflow-hidden ${className}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        ...style,
      }}
      {...props}
    >
      {/* Title Bar */}
      <div
        className="h-[52px] flex items-center px-4 border-b border-[var(--separator)] select-none cursor-default"
        onMouseDown={handleMouseDown}
      >
        <div className="traffic-lights flex gap-2">
          <MacOSTrafficLights
            onClose={onClose}
            onMinimize={onMinimize}
            onMaximize={onMaximize}
          />
        </div>
        {title && (
          <div className="flex-1 text-center font-semibold text-[13px] text-[var(--label)] opacity-80">
            {title}
          </div>
        )}
        {/* Spacer to balance traffic lights */}
        <div className="w-[52px]" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative">{children}</div>

      {/* Resize Handle (Simple implementation) */}
      {resizable && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
          onMouseDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = size.width;
            const startHeight = size.height;

            const handleResize = (moveEvent: MouseEvent) => {
              setSize({
                width: Math.max(
                  minSize.width,
                  startWidth + (moveEvent.clientX - startX)
                ),
                height: Math.max(
                  minSize.height,
                  startHeight + (moveEvent.clientY - startY)
                ),
              });
            };

            const stopResize = () => {
              window.removeEventListener("mousemove", handleResize);
              window.removeEventListener("mouseup", stopResize);
            };

            window.addEventListener("mousemove", handleResize);
            window.addEventListener("mouseup", stopResize);
          }}
        />
      )}
    </div>
  );
};
