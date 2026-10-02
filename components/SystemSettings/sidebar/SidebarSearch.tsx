import React from "react";
import { Search } from "lucide-react";

interface SidebarSearchProps {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  isDark: boolean;
}

export const SidebarSearch: React.FC<SidebarSearchProps> = ({
  placeholder,
  value,
  onChange,
  isDark,
}) => {
  return (
    <div className="pt-9 pb-3 px-3">
      <div className="relative">
        <Search
          size={13}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-[8px] pl-8 pr-3 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all placeholder-gray-400 font-normal"
          style={{
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.8)",
            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
            color: isDark ? "#f5f5f7" : "#1c1c1e",
          }}
          aria-label="Search settings"
        />
      </div>
    </div>
  );
};
