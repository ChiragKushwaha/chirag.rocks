import React from "react";

export const MacOSStatusBar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="h-6 bg-[#F6F6F6] dark:bg-[#282828] border-t border-[#D1D1D6] dark:border-black/50 flex items-center px-3 text-[11px] text-gray-500 dark:text-gray-400 select-none">
      {children}
    </div>
  );
};
