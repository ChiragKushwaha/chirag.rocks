import React from "react";

interface Segment {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface MacOSSegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const MacOSSegmentedControl: React.FC<MacOSSegmentedControlProps> = ({
  segments,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex bg-[var(--control-background)] p-0.5 rounded-lg border border-[var(--control-border)] shadow-sm ${className}`}
    >
      {segments.map((segment) => {
        const isSelected = segment.value === value;
        return (
          <button
            key={segment.value}
            onClick={() => onChange(segment.value)}
            className={`
              relative px-3 py-1 text-[13px] font-medium rounded-[6px] transition-all duration-200
              flex items-center gap-1.5
              ${
                isSelected
                  ? "bg-white dark:bg-[#636366] text-black dark:text-white shadow-sm"
                  : "text-[var(--secondary-label)] hover:text-[var(--label)] hover:bg-black/5 dark:hover:bg-white/10"
              }
            `}
          >
            {segment.icon && <span className="opacity-80">{segment.icon}</span>}
            {segment.label}
          </button>
        );
      })}
    </div>
  );
};
