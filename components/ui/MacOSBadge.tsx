import React from "react";

export const MacOSBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count <= 0) return null;
  return (
    <div className="bg-[#FF3B30] text-white text-[10px] font-bold px-1.5 h-[16px] min-w-[16px] flex items-center justify-center rounded-full shadow-sm">
      {count}
    </div>
  );
};
