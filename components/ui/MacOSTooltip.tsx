import React, { useState } from "react";

interface MacOSTooltipProps {
  content: string;
  children: React.ReactNode;
  delay?: number;
  position?: "top" | "bottom" | "left" | "right";
}

export const MacOSTooltip: React.FC<MacOSTooltipProps> = ({
  content,
  children,
  delay = 500,
  position = "top",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-1.5 text-[12px] text-[var(--background)] bg-[var(--label)] rounded shadow-sm whitespace-nowrap pointer-events-none animate-in fade-in duration-200 ${positionClasses[position]}`}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-[var(--label)] transform rotate-45
              ${
                position === "top"
                  ? "bottom-[-3px] left-1/2 -translate-x-1/2"
                  : ""
              }
              ${
                position === "bottom"
                  ? "top-[-3px] left-1/2 -translate-x-1/2"
                  : ""
              }
              ${
                position === "left"
                  ? "right-[-3px] top-1/2 -translate-y-1/2"
                  : ""
              }
              ${
                position === "right"
                  ? "left-[-3px] top-1/2 -translate-y-1/2"
                  : ""
              }
            `}
          />
        </div>
      )}
    </div>
  );
};
