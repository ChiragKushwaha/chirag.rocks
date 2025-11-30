import React from "react";

export const MacOSColorWell: React.FC<{
  color: string;
  onChange: (c: string) => void;
}> = ({ color, onChange }) => {
  return (
    <div className="relative w-10 h-6 rounded-[4px] border border-[#D1D1D6] dark:border-[#4D4D4D] p-[2px] shadow-sm bg-white dark:bg-[#1E1E1E]">
      <div
        className="w-full h-full rounded-[2px]"
        style={{ backgroundColor: color }}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
    </div>
  );
};
