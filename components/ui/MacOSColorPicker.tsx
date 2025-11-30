import React from "react";

interface MacOSColorPickerProps {
  color?: string;
  onChange?: (color: string) => void;
  className?: string;
}

export const MacOSColorPicker: React.FC<MacOSColorPickerProps> = ({
  color = "#007AFF",
  onChange,
  className = "",
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange?.(e.target.value)}
        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
      />
      <div
        className="w-6 h-6 rounded-full border border-[var(--separator)] shadow-sm"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
