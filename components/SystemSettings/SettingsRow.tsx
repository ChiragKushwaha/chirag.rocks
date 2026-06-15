import React from "react";

interface SettingsRowProps {
  icon?: React.ElementType;
  label: string;
  sublabel?: string;
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
  sublabel,
  value,
  onClick,
  color = "#8E8E93",
  isLast = false,
  children,
  type,
}) => (
  <div
    onClick={onClick}
    onKeyDown={(e) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    }}
    role={type === "toggle" ? "switch" : onClick ? "button" : undefined}
    aria-checked={type === "toggle" ? !!value : undefined}
    tabIndex={onClick ? 0 : -1}
    className={`flex items-center gap-3 px-4 py-2.5 min-h-[44px] transition-colors focus:outline-none cursor-default
      hover:bg-black/[0.035] dark:hover:bg-white/[0.06]
      ${!isLast ? "border-b border-black/[0.06] dark:border-white/[0.06]" : ""}
    `}
  >
    {Icon && (
      <div
        className="w-7 h-7 rounded-[7px] flex items-center justify-center text-white shadow-sm shrink-0"
        style={{ backgroundColor: color }}
      >
        <Icon size={15} />
      </div>
    )}
    <div className="flex-1 flex items-center justify-between min-w-0">
      <div className="flex flex-col">
        <span className="text-[13px] text-gray-900 dark:text-gray-100">
          {label}
        </span>
        {sublabel && (
          <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
            {sublabel}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {type === "toggle" ? (
          <MacToggle checked={!!value} onChange={() => {}} onClick={onClick} />
        ) : (
          typeof value === "string" && (
            <span className="text-[13px] text-gray-500 dark:text-gray-400">
              {value}
            </span>
          )
        )}
        {children}
        {!children && type !== "toggle" && onClick && (
          <svg
            className="text-gray-400"
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
          >
            <path
              d="M1 1l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  </div>
);

// macOS-style toggle switch
const MacToggle = ({
  checked,
  onChange,
  onClick,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  onClick?: () => void;
}) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick();
      else onChange(!checked);
    }}
    className="relative shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-full"
    style={{
      width: 38,
      height: 22,
      background: checked ? "#34C759" : "rgba(120,120,128,0.32)",
      transition: "background 0.2s ease",
    }}
  >
    <span
      className="absolute rounded-full bg-white shadow"
      style={{
        width: 18,
        height: 18,
        top: 2,
        left: checked ? 18 : 2,
        transition: "left 0.18s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }}
    />
  </button>
);
