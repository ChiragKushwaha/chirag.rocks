import React from "react";
import { Check } from "lucide-react";

interface MacOSCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const MacOSCheckbox: React.FC<MacOSCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled,
}) => {
  return (
    <label
      className={`flex items-center gap-2 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-default"
      }`}
    >
      <div
        className={`
          w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-all shadow-sm
          ${
            checked
              ? "bg-[#007AFF] border-[#0062CC]"
              : "bg-white dark:bg-[#1E1E1E] border-[#D1D1D6] dark:border-[#4D4D4D]"
          }
        `}
      >
        {checked && <Check size={10} strokeWidth={4} className="text-white" />}
      </div>
      {label && (
        <span className="text-[13px] text-gray-900 dark:text-white">
          {label}
        </span>
      )}

      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
      />
    </label>
  );
};
