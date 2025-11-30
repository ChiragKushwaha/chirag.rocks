import React from "react";

interface MacOSRadioProps {
  checked: boolean;
  label: string;
  name: string;
  onChange: () => void;
  disabled?: boolean;
}

export const MacOSRadio: React.FC<MacOSRadioProps> = ({
  checked,
  label,
  name,
  onChange,
  disabled,
}) => {
  return (
    <label
      className={`flex items-center gap-2 select-none ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="hidden"
        disabled={disabled}
      />
      <div
        className={`
        w-3.5 h-3.5 rounded-full border flex items-center justify-center
        ${
          checked
            ? "bg-[#007AFF] border-[#0062CC]"
            : "bg-white dark:bg-[#1E1E1E] border-[#D1D1D6] dark:border-[#4D4D4D]"
        }
      `}
      >
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
      <span className="text-[13px] text-black dark:text-white">{label}</span>
    </label>
  );
};
