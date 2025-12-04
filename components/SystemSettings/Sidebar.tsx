import React from "react";
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
} from "lucide-react";
import { SettingsSidebarItem } from "./SettingsSidebarItem";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentAvatar: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentAvatar,
}) => {
  return (
    <div className="w-[240px] shrink-0 bg-[#e8e8ed]/50 dark:bg-[#2b2b2b]/50 backdrop-blur-xl border-r border-gray-200 dark:border-black/20 flex flex-col pt-8 pb-4 px-3 overflow-y-auto">
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
            aria-label="Search settings"
          />
        </div>
      </div>

      {/* User Profile */}
      <div
        className={`flex items-center gap-3 px-2 mb-6 cursor-pointer rounded-md py-2 transition-colors ${
          activeTab === "General"
            ? "bg-black/5 dark:bg-white/10"
            : "hover:bg-black/5 dark:hover:bg-white/5"
        }`}
        onClick={() => setActiveTab("General")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setActiveTab("General");
          }
        }}
        aria-label="User profile settings"
      >
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex items-center justify-center text-2xl">
          {currentAvatar}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight dark:text-gray-200">
            Chirag
          </span>
          <span className="text-xs text-gray-500">Apple Account</span>
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
          icon={Layout}
          label="Menu Bar"
          color="#8E8E93"
          isActive={activeTab === "Menu Bar"}
          onClick={() => setActiveTab("Menu Bar")}
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
          icon={Search}
          label="Spotlight"
          color="#5856D6"
          isActive={activeTab === "Spotlight"}
          onClick={() => setActiveTab("Spotlight")}
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
        <SettingsSidebarItem
          icon={Volume2}
          label="Sound"
          color="#FF2D55"
          isActive={activeTab === "Sound"}
          onClick={() => setActiveTab("Sound")}
        />
        <SettingsSidebarItem
          icon={Bell}
          label="Notifications"
          color="#FF3B30"
          isActive={activeTab === "Notifications"}
          onClick={() => setActiveTab("Notifications")}
        />
        <SettingsSidebarItem
          icon={Moon}
          label="Focus"
          color="#5856D6"
          isActive={activeTab === "Focus"}
          onClick={() => setActiveTab("Focus")}
        />
        <SettingsSidebarItem
          icon={Hourglass}
          label="Screen Time"
          color="#5856D6"
          isActive={activeTab === "Screen Time"}
          onClick={() => setActiveTab("Screen Time")}
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
        <SettingsSidebarItem
          icon={Fingerprint}
          label="Touch ID & Password"
          color="#8E8E93"
          isActive={activeTab === "Touch ID & Password"}
          onClick={() => setActiveTab("Touch ID & Password")}
        />
        <SettingsSidebarItem
          icon={User}
          label="Users & Groups"
          color="#8E8E93"
          isActive={activeTab === "Users & Groups"}
          onClick={() => setActiveTab("Users & Groups")}
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
          icon={Printer}
          label="Printers & Scanners"
          color="#8E8E93"
          isActive={activeTab === "Printers & Scanners"}
          onClick={() => setActiveTab("Printers & Scanners")}
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
  );
};
