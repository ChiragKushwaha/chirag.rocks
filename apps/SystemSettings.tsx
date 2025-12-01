import React, { useState } from "react";
import Image from "next/image";
import {
  Wifi,
  Bluetooth,
  Globe,
  User,
  Moon,
  Monitor,
  Battery,
  Volume2,
  Search,
  Info,
  ChevronRight,
  Lock,
  Keyboard,
  Mouse,
  HardDrive,
  Image as ImageIcon,
} from "lucide-react";
import { useSystemStore } from "../store/systemStore";

interface SettingsSidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  color: string;
  onClick: () => void;
}

const SettingsSidebarItem: React.FC<SettingsSidebarItemProps> = ({
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
      className="w-6 h-6 rounded-md flex items-center justify-center text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      <Icon size={14} />
    </div>
    <span>{label}</span>
  </button>
);

export const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Appearance");
  const { theme, toggleTheme, wallpaper, setWallpaper } = useSystemStore();
  const isDark = theme === "dark";

  const wallpapers = [
    { name: "Sonoma", url: "/System/Library/Desktop Pictures/Sonoma.heic" },
    { name: "Ventura", url: "/System/Library/Desktop Pictures/Ventura.heic" },
    { name: "Monterey", url: "/System/Library/Desktop Pictures/Monterey.heic" },
    { name: "Big Sur", url: "/System/Library/Desktop Pictures/Big Sur.heic" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Appearance":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Moon size={32} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold dark:text-white">
                  Appearance
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select your preferred appearance.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
              <h3 className="text-sm font-medium mb-4 dark:text-white">
                Appearance
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => !isDark && toggleTheme()} // No-op if already light (logic inverted for demo, usually explicit set)
                  className={`flex flex-col items-center gap-2 group ${
                    !isDark ? "opacity-100" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <div className="w-20 h-14 rounded-lg bg-[#f5f5f5] border border-gray-300 shadow-sm flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white" />
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gray-200" />
                  </div>
                  <span className="text-xs dark:text-gray-300">Light</span>
                  {!isDark && (
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => isDark && toggleTheme()} // No-op
                  className={`flex flex-col items-center gap-2 group ${
                    isDark ? "opacity-100" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <div className="w-20 h-14 rounded-lg bg-[#1e1e1e] border border-gray-600 shadow-sm flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#2b2b2b]" />
                    <div className="absolute top-0 left-0 right-0 h-3 bg-[#3a3a3a]" />
                  </div>
                  <span className="text-xs dark:text-gray-300">Dark</span>
                  {isDark && (
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </button>

                <button
                  onClick={toggleTheme}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-20 h-14 rounded-lg bg-gradient-to-r from-[#f5f5f5] to-[#1e1e1e] border border-gray-300 dark:border-gray-600 shadow-sm flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white to-[#2b2b2b]" />
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-gray-200 to-[#3a3a3a]" />
                  </div>
                  <span className="text-xs dark:text-gray-300">Auto</span>
                </button>
              </div>
            </div>
          </div>
        );

      case "Wallpaper":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <ImageIcon size={32} className="text-cyan-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold dark:text-white">
                  Wallpaper
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose a desktop picture.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
              <div className="grid grid-cols-3 gap-4">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.name}
                    onClick={() => setWallpaper(wp.url)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      wallpaper === wp.url
                        ? "border-blue-500 shadow-md"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Image
                      src={wp.url}
                      alt={wp.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 backdrop-blur-sm">
                      {wp.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "General":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Info size={32} className="text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold dark:text-white">
                  General
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View system information.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50">
                <span className="text-sm dark:text-gray-300">Name</span>
                <span className="text-sm text-gray-500">MacBook Pro</span>
              </div>
              <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50">
                <span className="text-sm dark:text-gray-300">
                  macOS Version
                </span>
                <span className="text-sm text-gray-500">Sonoma 14.0</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">Chip</span>
                <span className="text-sm text-gray-500">Apple M3 Max</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Info size={32} />
            </div>
            <p>This section is not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-[#f5f5f7] dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans select-none">
      {/* Sidebar */}
      <div className="w-[240px] flex-shrink-0 bg-[#e8e8ed]/50 dark:bg-[#2b2b2b]/50 backdrop-blur-xl border-r border-gray-200 dark:border-black/20 flex flex-col pt-8 pb-4 px-3 overflow-y-auto">
        {/* Search */}
        <div className="mb-4 px-1">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white/50 dark:bg-white/10 border border-gray-300/50 dark:border-black/20 rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
            {/* Placeholder for user avatar */}
            <User
              size={24}
              className="m-auto mt-2 text-gray-500 dark:text-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">Chirag</span>
            <span className="text-xs text-gray-500">Apple ID</span>
          </div>
        </div>

        <div className="space-y-1">
          <SettingsSidebarItem
            icon={Wifi}
            label="Wi-Fi"
            color="#007AFF"
            isActive={activeTab === "Wi-Fi"}
            onClick={() => setActiveTab("Wi-Fi")}
          />
          <SettingsSidebarItem
            icon={Bluetooth}
            label="Bluetooth"
            color="#007AFF"
            isActive={activeTab === "Bluetooth"}
            onClick={() => setActiveTab("Bluetooth")}
          />
          <SettingsSidebarItem
            icon={Globe}
            label="Network"
            color="#007AFF"
            isActive={activeTab === "Network"}
            onClick={() => setActiveTab("Network")}
          />
        </div>

        <div className="my-3 border-b border-gray-300/50 dark:border-white/10 mx-2" />

        <div className="space-y-1">
          <SettingsSidebarItem
            icon={Info}
            label="General"
            color="#8E8E93"
            isActive={activeTab === "General"}
            onClick={() => setActiveTab("General")}
          />
          <SettingsSidebarItem
            icon={Moon}
            label="Appearance"
            color="#A2845E"
            isActive={activeTab === "Appearance"}
            onClick={() => setActiveTab("Appearance")}
          />
          <SettingsSidebarItem
            icon={Info}
            label="Accessibility"
            color="#007AFF"
            isActive={activeTab === "Accessibility"}
            onClick={() => setActiveTab("Accessibility")}
          />
          <SettingsSidebarItem
            icon={Monitor}
            label="Control Center"
            color="#8E8E93"
            isActive={activeTab === "Control Center"}
            onClick={() => setActiveTab("Control Center")}
          />
          <SettingsSidebarItem
            icon={Monitor}
            label="Desktop & Dock"
            color="#8E8E93"
            isActive={activeTab === "Desktop & Dock"}
            onClick={() => setActiveTab("Desktop & Dock")}
          />
          <SettingsSidebarItem
            icon={Monitor}
            label="Displays"
            color="#007AFF"
            isActive={activeTab === "Displays"}
            onClick={() => setActiveTab("Displays")}
          />
          <SettingsSidebarItem
            icon={ImageIcon}
            label="Wallpaper"
            color="#32ADE6"
            isActive={activeTab === "Wallpaper"}
            onClick={() => setActiveTab("Wallpaper")}
          />
          <SettingsSidebarItem
            icon={Monitor}
            label="Screen Saver"
            color="#32ADE6"
            isActive={activeTab === "Screen Saver"}
            onClick={() => setActiveTab("Screen Saver")}
          />
          <SettingsSidebarItem
            icon={Battery}
            label="Battery"
            color="#34C759"
            isActive={activeTab === "Battery"}
            onClick={() => setActiveTab("Battery")}
          />
        </div>

        <div className="my-3 border-b border-gray-300/50 dark:border-white/10 mx-2" />

        <div className="space-y-1">
          <SettingsSidebarItem
            icon={Lock}
            label="Privacy & Security"
            color="#007AFF"
            isActive={activeTab === "Privacy & Security"}
            onClick={() => setActiveTab("Privacy & Security")}
          />
          <SettingsSidebarItem
            icon={Lock}
            label="Lock Screen"
            color="#8E8E93"
            isActive={activeTab === "Lock Screen"}
            onClick={() => setActiveTab("Lock Screen")}
          />
        </div>

        <div className="my-3 border-b border-gray-300/50 dark:border-white/10 mx-2" />

        <div className="space-y-1">
          <SettingsSidebarItem
            icon={Keyboard}
            label="Keyboard"
            color="#8E8E93"
            isActive={activeTab === "Keyboard"}
            onClick={() => setActiveTab("Keyboard")}
          />
          <SettingsSidebarItem
            icon={Mouse}
            label="Trackpad"
            color="#8E8E93"
            isActive={activeTab === "Trackpad"}
            onClick={() => setActiveTab("Trackpad")}
          />
          <SettingsSidebarItem
            icon={HardDrive}
            label="Storage"
            color="#8E8E93"
            isActive={activeTab === "Storage"}
            onClick={() => setActiveTab("Storage")}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-2xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
};
