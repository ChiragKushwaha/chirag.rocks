import React from "react";
import { ChevronDown } from "lucide-react";

interface MacOSSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const MacOSSelect: React.FC<MacOSSelectProps> = ({
  className = "",
  label,
  children,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-medium text-gray-500 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            appearance-none w-full
            bg-white dark:bg-[#606060] 
            text-black dark:text-white 
            border border-[#D1D1D6] dark:border-[#4D4D4D]
            rounded-[5px] py-[3px] pl-3 pr-8 text-[13px] font-medium
            shadow-[0_1px_1px_rgba(0,0,0,0.05)]
            focus:outline-none focus:ring-1 focus:ring-[#007AFF]
            disabled:opacity-50
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="flex flex-col -space-y-1 text-gray-500 dark:text-gray-300">
            <ChevronDown size={12} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};
