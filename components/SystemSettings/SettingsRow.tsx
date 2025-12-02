import React from "react";
import { ChevronRight } from "lucide-react";

interface SettingsRowProps {
  icon?: React.ElementType;
  label: string;
  value?: string | boolean;
  onClick?: () => void;
  color?: string;
  isLast?: boolean;
  children?: React.ReactNode;
  type?: "default" | "toggle" | "dropdown";
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon: Icon,
  label,
  value,
  onClick,
  color = "#8E8E93",
  isLast = false,
  children,
  type,
}) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3 min-h-[48px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${
      !isLast ? "border-b border-gray-100 dark:border-gray-700/50" : ""
    }`}
  >
    {Icon && (
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        <Icon size={16} />
      </div>
    )}
    <div className="flex-1 flex items-center justify-between">
      <span className="text-[13px] font-medium dark:text-gray-200">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {type === "toggle" ? (
          <div
            className={`w-10 h-6 rounded-full p-1 transition-colors ${
              value ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                value ? "translate-x-4" : ""
              }`}
            />
          </div>
        ) : (
          value && <span className="text-[13px] text-gray-500">{value}</span>
        )}
        {children}
        {!children && type !== "toggle" && (
          <ChevronRight size={14} className="text-gray-400" />
        )}
      </div>
    </div>
  </div>
);
