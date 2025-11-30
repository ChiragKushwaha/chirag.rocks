import React from "react";

interface MacOSInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const MacOSInput: React.FC<MacOSInputProps> = ({
  className = "",
  icon,
  ...props
}) => {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        className={`
          w-full bg-white dark:bg-[#1E1E1E] 
          border border-[#D1D1D6] dark:border-[#4D4D4D]
          rounded-[5px] py-1 px-2 text-[13px] text-gray-900 dark:text-white
          shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]
          focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 focus:border-[#007AFF]
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          transition-all duration-100
          ${icon ? "pl-8" : ""}
          ${className}
        `}
        {...props}
      />
    </div>
  );
};
