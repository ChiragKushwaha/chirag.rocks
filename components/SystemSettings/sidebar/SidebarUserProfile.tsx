import React from "react";

interface SidebarUserProfileProps {
  currentAvatar: string;
  appleAccountLabel: string;
  isActive: boolean;
  isDark: boolean;
  onClick: () => void;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  currentAvatar,
  appleAccountLabel,
  isActive,
  isDark,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 mx-2.5 mb-2.5 px-2.5 py-2 rounded-[9px] transition-all text-left w-[calc(100%-20px)] ${
        isActive
          ? "bg-[#007AFF] text-white shadow-xs"
          : isDark
          ? "hover:bg-white/5 text-gray-200"
          : "hover:bg-black/5 text-gray-900"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-lg shrink-0 shadow-xs border border-white/20">
        {currentAvatar}
      </div>
      <div className="flex flex-col min-w-0">
        <span
          className={`text-[13px] font-semibold leading-tight ${
            isActive ? "text-white" : isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Chirag
        </span>
        <span
          className={`text-[11px] truncate ${
            isActive ? "text-white/80" : "text-[#007AFF] dark:text-[#0A84FF]"
          }`}
        >
          {appleAccountLabel}
        </span>
      </div>
    </button>
  );
};
