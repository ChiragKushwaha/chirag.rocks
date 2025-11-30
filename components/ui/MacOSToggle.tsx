import React from "react";

interface MacOSToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const MacOSToggle: React.FC<MacOSToggleProps> = ({
  checked,
  onChange,
  label,
  disabled,
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {label && (
        <span className="text-[13px] text-black dark:text-white">{label}</span>
      )}
      <button
        onClick={() => !disabled && onChange(!checked)}
        className={`
          w-9 h-5 rounded-full p-[2px] transition-colors duration-200 ease-in-out focus:outline-none
          ${checked ? "bg-[#34C759]" : "bg-[#E5E5EA] dark:bg-[#3A3A3C]"}
        `}
      >
        <div
          className={`
            w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200
            ${checked ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
};
