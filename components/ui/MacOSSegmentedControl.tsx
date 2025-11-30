import React from "react";

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export const MacOSSegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selected,
  onChange,
}) => {
  return (
    <div className="flex bg-[#D8D8D8] dark:bg-[#3A3A3C] p-[2px] rounded-[6px]">
      {options.map((opt) => {
        const isSelected = selected === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`
              flex-1 px-3 py-0.5 text-[12px] font-medium rounded-[4px] transition-all
              ${
                isSelected
                  ? "bg-white dark:bg-[#636366] shadow-sm text-black dark:text-white"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }
            `}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};
