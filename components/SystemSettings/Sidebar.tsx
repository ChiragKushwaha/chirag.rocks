"use client";
import React, { useState } from "react";
import {
  Wifi,
  Bluetooth,
  Globe,
  Info,
  Moon,
  Layout,
  Monitor,
  Image as ImageIcon,
  Battery,
  Lock,
  Keyboard,
  Mouse,
  HardDrive,
  Search,
  Volume2,
  Bell,
  Hourglass,
  Printer,
  User,
  Fingerprint,
  Shield,
  Film,
  Focus,
  Network,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentAvatar: string;
}

// Map each setting to an icon + background color (matching macOS System Settings icon palette)
const SETTING_ITEMS = [
  // Network
  { id: "Wi-Fi", icon: Wifi, color: "#007AFF", group: "network" },
  { id: "Bluetooth", icon: Bluetooth, color: "#007AFF", group: "network" },
  { id: "Network", icon: Network, color: "#007AFF", group: "network" },

  // Personalization
  { id: "General", icon: Info, color: "#8E8E93", group: "personal" },
  { id: "Appearance", icon: Moon, color: "#636366", group: "personal" },
  { id: "Accessibility", icon: Shield, color: "#007AFF", group: "personal" },
  { id: "Menu Bar", icon: Layout, color: "#8E8E93", group: "personal" },
  { id: "Desktop & Dock", icon: Monitor, color: "#636366", group: "personal" },
  { id: "Displays", icon: Monitor, color: "#007AFF", group: "personal" },
  { id: "Spotlight", icon: Search, color: "#5856D6", group: "personal" },
  { id: "Wallpaper", icon: ImageIcon, color: "#32ADE6", group: "personal" },
  { id: "Screen Saver", icon: Film, color: "#32ADE6", group: "personal" },
  { id: "Battery", icon: Battery, color: "#34C759", group: "personal" },
  { id: "Sound", icon: Volume2, color: "#FF2D55", group: "personal" },
  { id: "Notifications", icon: Bell, color: "#FF3B30", group: "personal" },
  { id: "Focus", icon: Focus, color: "#5856D6", group: "personal" },
  { id: "Screen Time", icon: Hourglass, color: "#5856D6", group: "personal" },

  // Privacy & Security
  { id: "Privacy & Security", icon: Lock, color: "#007AFF", group: "security" },
  { id: "Lock Screen", icon: Lock, color: "#8E8E93", group: "security" },
  { id: "Touch ID & Password", icon: Fingerprint, color: "#8E8E93", group: "security" },
  { id: "Users & Groups", icon: User, color: "#8E8E93", group: "security" },

  // Hardware
  { id: "Keyboard", icon: Keyboard, color: "#8E8E93", group: "hardware" },
  { id: "Trackpad", icon: Mouse, color: "#8E8E93", group: "hardware" },
  { id: "Printers & Scanners", icon: Printer, color: "#8E8E93", group: "hardware" },
  { id: "Storage", icon: HardDrive, color: "#FF9500", group: "hardware" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentAvatar,
}) => {
  const t = useTranslations("SystemSettings.Sidebar");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = searchQuery.trim()
    ? SETTING_ITEMS.filter((item) =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SETTING_ITEMS;

  return (
    <div
      className="w-[240px] shrink-0 flex flex-col overflow-hidden border-r"
      style={{
        background: "rgba(236,236,240,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "rgba(0,0,0,0.1)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      }}
    >
      {/* Top padding for traffic lights */}
      <div className="pt-10 pb-3 px-3">
        {/* Search bar */}
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
          <input
            type="text"
            placeholder={t("Search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[7px] pl-8 pr-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(0,0,0,0.10)",
              color: "#1c1c1e",
            }}
            aria-label="Search settings"
          />
        </div>
      </div>

      {/* User profile row */}
      <button
        onClick={() => setActiveTab("Apple Account")}
        className="flex items-center gap-3 mx-3 mb-3 px-3 py-2 rounded-xl transition-colors text-left"
        style={{
          background:
            activeTab === "Apple Account"
              ? "rgba(0,122,255,0.15)"
              : "transparent",
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "Apple Account")
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(0,0,0,0.05)";
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "Apple Account")
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
        }}
      >
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
          {currentAvatar}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-semibold text-gray-900 leading-tight">
            Chirag
          </span>
          <span className="text-[11px] text-blue-600 truncate">
            {t("AppleAccount")}
          </span>
        </div>
      </button>

      <div
        className="mx-4 mb-3 border-t"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      />

      {/* Settings list */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {filtered.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-all"
              style={{
                background: isActive
                  ? "rgba(0,122,255,0.18)"
                  : "transparent",
                color: isActive ? "#0A84FF" : "#1c1c1e",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(0,0,0,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              {/* Icon badge */}
              <div
                className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: item.color }}
              >
                <Icon size={14} color="white" />
              </div>
              <span
                className="text-[13px] font-medium truncate"
                style={{ color: isActive ? "#0A84FF" : "#1c1c1e" }}
              >
                {item.id}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
