import React from "react";

export const MacOSGroupBox: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  return (
    <div className="border border-[#D1D1D6] dark:border-[#4D4D4D] rounded-[6px] p-3 pt-4 relative mt-3">
      <span className="absolute -top-2 left-2 bg-[#F6F6F6] dark:bg-[#1E1E1E] px-1 text-[11px] font-medium text-gray-500">
        {label}
      </span>
      {children}
    </div>
  );
};
