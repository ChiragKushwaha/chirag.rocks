import React from "react";

interface MacOSSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const MacOSSlider: React.FC<MacOSSliderProps> = ({
  value,
  min,
  max,
  onChange,
  disabled,
}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      className={`
        w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer
        accent-[#007AFF] focus:outline-none
        ${disabled ? "opacity-50" : ""}
      `}
    />
  );
};
