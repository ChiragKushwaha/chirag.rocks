import React from "react";

export const MacOSProgress: React.FC<{ value: number; max?: number }> = ({
  value,
  max = 100,
}) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full h-[6px] bg-[#E5E5EA] dark:bg-[#3A3A3C] rounded-full overflow-hidden border border-black/5">
      <div
        className="h-full bg-[#007AFF] transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
