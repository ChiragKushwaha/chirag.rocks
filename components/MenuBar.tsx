import React from "react";
import { useSystemStore } from "../store/systemStore";
import { useMenuStore, MenuItem } from "../store/menuStore";
import { useProcessStore } from "../store/processStore";
import { TopDropdown } from "./Menus";
import { AboutMac } from "../apps/AboutMac";
import { Clock } from "./Clock";
import {
  Battery,
  Wifi,
  Search,
  Clipboard,
  Cloud,
  PlayCircle,
  BatteryCharging,
} from "lucide-react";
import { useBattery } from "../hooks/useBattery";

// --- RENDER HELPERS ---
const MenuButton: React.FC<{
  id: string;
  label: string | React.ReactNode;
  items: MenuItem[];
  bold?: boolean;
}> = ({ id, label, items, bold }) => {
  const { activeMenuId, setActiveMenu } = useMenuStore();
  const isActive = activeMenuId === id;

  return (
    <div className="relative h-full flex items-center">
      <button
        onMouseEnter={() => activeMenuId && setActiveMenu(id)}
        onClick={() => setActiveMenu(isActive ? null : id)}
        className={`
          h-full px-3 text-[13px] rounded transition-colors
          ${
            isActive
              ? "bg-white/20 text-white"
              : "hover:bg-white/10 active:bg-white/20"
          }
          ${bold ? "font-bold" : "font-normal"}
        `}
      >
        {label}
      </button>
      {/* Dropdown Positioned Relative to Button */}
      <TopDropdown
        items={items}
        isOpen={isActive}
        xOffset={0} // Adjust via CSS in TopDropdown if needed, simplified here
        onClose={() => setActiveMenu(null)}
      />
    </div>
  );
};

const SiriIcon = () => (
  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-90 shadow-sm" />
);

const ControlCenterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
    <path d="M8 10V20" />
    <path d="M8 4v2" />
    <path d="M14 16a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
    <path d="M16 18v2" />
    <path d="M16 4v10" />
    <path d="M16 4v10" />
  </svg>
);

const BatteryDisplay = () => {
  const { level, charging, loading, supported } = useBattery();

  // Fallback for SSR or unsupported browsers
  if (!supported || loading || level === null) {
    return (
      <div className="flex items-center gap-1.5 opacity-90 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
        <Battery size={22} strokeWidth={2} className="rotate-0 text-gray-400" />
      </div>
    );
  }

  const percentage = Math.round(level * 100);
  const isLow = percentage <= 20 && !charging;

  return (
    <div
      className="flex items-center gap-1.5 opacity-90 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default"
      title={`${percentage}% ${charging ? "Charging" : ""}`}
    >
      <div className="relative">
        {charging ? (
          <BatteryCharging
            size={22}
            strokeWidth={2}
            className="text-green-400"
          />
        ) : (
          <Battery
            size={22}
            strokeWidth={2}
            className={`rotate-0 ${isLow ? "text-red-500" : ""}`}
          />
        )}
        {/* Fill level overlay could be added here for more realism, but Lucide icons don't support partial fill easily. 
            For now, color indication is good. */}
      </div>
    </div>
  );
};

export const MenuBar: React.FC = () => {
  const { activeApp } = useSystemStore();
  const { activeMenuId, setActiveMenu } = useMenuStore();
  const { launchProcess } = useProcessStore();

  // --- MENU CONFIGURATIONS ---
  const handleAppleClick = () => {
    setActiveMenu(activeMenuId === "apple" ? null : "apple");
  };

  const appleItems: MenuItem[] = [
    {
      label: "About This Mac",
      action: () =>
        launchProcess("about", "About This Mac", "🍎", <AboutMac />, {
          width: 320,
          height: 420,
          x: 300,
          y: 200,
        }),
    },
    { separator: true },
    { label: "System Settings...", disabled: true },
    { label: "App Store...", disabled: true },
    { separator: true },
    { label: "Recent Items", submenu: [] }, // Submenus can be expanded later
    { separator: true },
    { label: "Force Quit...", shortcut: "⌥⌘Esc", danger: true },
    { separator: true },
    { label: "Sleep" },
    { label: "Restart..." },
    { label: "Shut Down..." },
    { separator: true },
    { label: "Lock Screen", shortcut: "⌃⌘Q" },
  ];

  const getFileItems = (): MenuItem[] => {
    if (activeApp === "TextEdit") {
      return [
        { label: "New", shortcut: "⌘N" },
        { label: "Open...", shortcut: "⌘O" },
        { separator: true },
        { label: "Save", shortcut: "⌘S" },
        { label: "Duplicate", shortcut: "⇧⌘S" },
      ];
    }
    // Default Finder Items
    return [
      { label: "New Finder Window", shortcut: "⌘N" },
      { label: "New Folder", shortcut: "⇧⌘N" },
      { separator: true },
      { label: "Get Info", shortcut: "⌘I" },
    ];
  };

  // --- RENDER HELPERS ---
  // MenuButton moved outside

  return (
    <header
      className="h-[30px] bg-white/30 dark:bg-black/30 backdrop-blur-[50px] saturate-150 flex items-center justify-between px-4 text-black dark:text-white shadow-sm fixed top-0 w-full z-[8000] select-none transition-colors duration-300"
      onClick={(e) => e.stopPropagation()} // Prevent clicking bar from closing menus
    >
      <div className="flex items-center h-full gap-1">
        {/* Apple Menu */}
        <MenuButton
          id="apple"
          label={<span className="text-[15px] pb-0.5"></span>}
          items={appleItems}
        />

        {/* App Name */}
        <MenuButton
          id="app"
          label={activeApp}
          items={[
            { label: `About ${activeApp}` },
            { separator: true },
            { label: `Quit ${activeApp}`, shortcut: "⌘Q" },
          ]}
          bold
        />

        {/* Standard Menus */}
        <MenuButton id="file" label="File" items={getFileItems()} />
        <MenuButton
          id="edit"
          label="Edit"
          items={[
            { label: "Undo", shortcut: "⌘Z" },
            { label: "Redo", shortcut: "⇧⌘Z" },
            { separator: true },
            { label: "Cut", shortcut: "⌘X" },
            { label: "Copy", shortcut: "⌘C" },
            { label: "Paste", shortcut: "⌘V" },
          ]}
        />
        <MenuButton
          id="view"
          label="View"
          items={[
            { label: "As Icons" },
            { label: "As List" },
            { label: "As Columns" },
          ]}
        />
        <MenuButton
          id="window"
          label="Window"
          items={[{ label: "Minimize", shortcut: "⌘M" }, { label: "Zoom" }]}
        />
        <MenuButton id="help" label="Help" items={[{ label: "macOS Help" }]} />
      </div>

      {/* Right Side Status */}
      <div className="flex items-center gap-4 px-2 text-[13px] font-medium">
        {/* Clipboard */}
        <div className="opacity-90 hover:bg-white/10 p-1 rounded cursor-default">
          <Clipboard size={16} strokeWidth={2} />
        </div>

        {/* Weather */}
        <div className="flex items-center gap-1.5 opacity-90 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
          <Cloud
            size={16}
            strokeWidth={2}
            fill="currentColor"
            className="text-white/90"
          />
          <span>11°C</span>
        </div>

        {/* Media */}
        <div className="opacity-90 hover:bg-white/10 p-1 rounded cursor-default">
          <PlayCircle size={16} strokeWidth={2} />
        </div>

        {/* Battery */}
        <BatteryDisplay />

        {/* Wifi */}
        <div className="opacity-90 hover:bg-white/10 p-1 rounded cursor-default">
          <Wifi size={16} strokeWidth={2.5} />
        </div>

        {/* Search */}
        <div
          className="opacity-90 hover:bg-white/10 p-1 rounded cursor-default active:bg-white/20"
          onClick={() => useSystemStore.getState().toggleSpotlight()}
        >
          <Search size={15} strokeWidth={2.5} />
        </div>

        {/* Control Center */}
        <div className="opacity-90 hover:bg-white/10 p-1 rounded cursor-default">
          <ControlCenterIcon />
        </div>

        {/* Siri */}
        <div className="opacity-90 hover:bg-white/10 p-1 rounded cursor-default">
          <SiriIcon />
        </div>

        {/* Clock */}
        <Clock />
      </div>
    </header>
  );
};
