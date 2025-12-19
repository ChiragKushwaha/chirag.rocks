import React from "react";

// --- MACOS TABLE ROW ---
// Used for lists like Language selection
export const MacOSTableRow: React.FC<{
  selected?: boolean;
  label: string;
  subLabel?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}> = ({ selected, label, subLabel, onClick, icon }) => (
  <div
    onClick={onClick}
    onKeyDown={(e) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    }}
    role="button"
    tabIndex={0}
    className={`
      flex items-center justify-between px-2.5 py-[3px] text-[13px] cursor-default rounded-[4px] mx-1 focus:outline-none focus:ring-1 focus:ring-blue-500
      ${
        selected
          ? "bg-[#007AFF] text-white"
          : "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 even:bg-black/[0.02] dark:even:bg-white/[0.02]"
      }
    `}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className="leading-tight">{label}</span>
    </div>
    {subLabel && (
      <span
        className={`text-[11px] ${
          selected ? "text-white/80" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {subLabel}
      </span>
    )}
  </div>
);
