import React from "react";

interface SettingsSidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  color: string;
  onClick: () => void;
}

export const SettingsSidebarItem: React.FC<SettingsSidebarItemProps> = ({
  icon: Icon,
  label,
  isActive,
  color,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] transition-colors ${
      isActive
        ? "bg-blue-500 text-white font-medium"
        : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10"
    }`}
  >
    <div
      className={`w-6 h-6 rounded-md flex items-center justify-center text-white shadow-sm ${
        isActive ? "text-white" : ""
      }`}
      style={{ backgroundColor: color }}
    >
      <Icon size={14} />
    </div>
    <span>{label}</span>
  </button>
);
