import React from "react";

export const MacOSPopover: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  onClose: () => void;
}> = ({ children, x, y, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 z-[8000]" onClick={onClose} />
      <div
        style={{ top: y, left: x }}
        className="fixed z-[8001] bg-[#F6F6F6]/90 dark:bg-[#1E1E1E]/90 backdrop-blur-xl rounded-[8px] shadow-lg border border-black/10 p-3 min-w-[200px]"
      >
        {children}
        {/* Simple arrow placeholder */}
        <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#F6F6F6]/90 dark:bg-[#1E1E1E]/90 border-t border-l border-black/10 rotate-45" />
      </div>
    </>
  );
};
