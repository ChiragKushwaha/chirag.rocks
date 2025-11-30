import React from "react";

interface MacOSHomeIndicatorProps {
  className?: string;
}

export const MacOSHomeIndicator: React.FC<MacOSHomeIndicatorProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`fixed bottom-1 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black dark:bg-white rounded-full opacity-40 z-[9999] pointer-events-none ${className}`}
    />
  );
};
