import React from "react";

interface MacOSSheetProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  width?: number;
  height?: number;
}

export const MacOSSheet: React.FC<MacOSSheetProps> = ({
  isOpen,
  children,
  onClose,
  width = 500,
  height = 300,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex justify-center items-start pt-8 pointer-events-auto">
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        style={{ width, height }}
        className="relative bg-[#ECECEC] dark:bg-[#2C2C2E] rounded-b-[10px] shadow-xl border border-black/10 animate-in slide-in-from-top-4 duration-300 flex flex-col"
      >
        {children}
      </div>
    </div>
  );
};
