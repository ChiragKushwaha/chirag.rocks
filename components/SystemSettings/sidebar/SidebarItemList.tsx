import React from "react";
import { SettingItem } from "./types";

interface SidebarItemListProps {
  items: SettingItem[];
  activeTab: string;
  isDark: boolean;
  onSelect: (id: string) => void;
}

export const SidebarItemList: React.FC<SidebarItemListProps> = ({
  items,
  activeTab,
  isDark,
  onSelect,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[7px] text-left transition-all ${
              isActive
                ? "bg-[#007AFF] text-white shadow-xs font-medium"
                : isDark
                ? "text-[#f5f5f7] hover:bg-white/[0.06]"
                : "text-[#1c1c1e] hover:bg-black/[0.05]"
            }`}
          >
            {/* Colorful Big Sur Icon Badge */}
            <div
              className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center shrink-0 shadow-xs"
              style={{ background: item.color }}
            >
              <Icon size={14} color="white" strokeWidth={2.2} />
            </div>

            <span className="text-[13px] font-normal truncate">
              {item.id}
            </span>
          </button>
        );
      })}
    </div>
  );
};
