import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface MacOSStepperProps {
  value: number;
  onChange: (val: number) => void;
}

export const MacOSStepper: React.FC<MacOSStepperProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center border border-[#D1D1D6] dark:border-[#4D4D4D] rounded-[5px] bg-white dark:bg-[#1E1E1E] overflow-hidden shadow-sm h-[22px]">
      <div className="px-2 text-[13px] border-r border-[#D1D1D6] dark:border-[#4D4D4D] min-w-[40px] text-center">
        {value}
      </div>
      <div className="flex flex-col border-l border-white/10">
        <button
          onClick={() => onChange(value + 1)}
          className="h-[10px] px-1 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
        >
          <ChevronUp size={8} />
        </button>
        <button
          onClick={() => onChange(value - 1)}
          className="h-[10px] px-1 border-t border-[#D1D1D6] dark:border-[#4D4D4D] hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
        >
          <ChevronDown size={8} />
        </button>
      </div>
    </div>
  );
};
