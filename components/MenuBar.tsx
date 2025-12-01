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
  WifiOff,
  Lock,
  Search,
  Clipboard,
  Cloud,
  PlayCircle,
} from "lucide-react";
import { useBattery } from "../hooks/useBattery";
import { useWeather } from "../hooks/useWeather";
import { WeatherDropdown } from "./WeatherDropdown";

const WifiDisplay = () => {
  const { wifiEnabled, toggleWifi } = useSystemStore();

  const wifiIcon = (
    <div className="opacity-90 hover:bg-white/10 p-1 rounded cursor-default">
      {wifiEnabled ? (
        <Wifi size={16} strokeWidth={2.5} />
      ) : (
        <WifiOff size={16} strokeWidth={2.5} className="text-gray-400" />
      )}
    </div>
  );

  const wifiItems: MenuItem[] = [
    {
      label: (
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold">Wi-Fi</span>
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
              wifiEnabled ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                wifiEnabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      ),
      action: toggleWifi,
      stayOpenOnAction: true,
    },
    { separator: true },
    {
      label: (
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">
          Known Networks
        </span>
      ),
      disabled: true,
    },
    {
      label: "Pcnncc4G",
      icon: <Wifi size={14} />,
      shortcut: <Lock size={12} />,
      disabled: !wifiEnabled,
    },
    {
      label: "Pcnncc5G",
      icon: <Wifi size={14} />,
      shortcut: <Lock size={12} />,
      disabled: !wifiEnabled,
    },
    { separator: true },
    { label: "Other Networks", disabled: !wifiEnabled },
    { separator: true },
    { label: "Wi-Fi Settings..." },
  ];

  return <MenuButton id="wifi" label={wifiIcon} items={wifiItems} />;
};

// --- RENDER HELPERS ---
const MenuButton: React.FC<{
  id: string;
  label: string | React.ReactNode;
  items: MenuItem[];
  bold?: boolean;
}> = ({ id, label, items, bold }) => {
  const { activeMenuId, setActiveMenu } = useMenuStore();
  const isActive = activeMenuId === id;
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [xOffset, setXOffset] = React.useState(0);

  React.useEffect(() => {
    if (isActive && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setXOffset(rect.left);
    }
  }, [isActive]);

  return (
    <div className="relative h-full flex items-center">
      <button
        ref={buttonRef}
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
        xOffset={xOffset}
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
  const fillWidth = Math.max(0, Math.min(12, 12 * level));

  const batteryIcon = (
    <div
      className="flex items-center gap-1.5 opacity-90"
      title={`${percentage}% ${charging ? "Charging" : ""}`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          charging ? "text-green-400" : isLow ? "text-red-500" : "text-gray-200"
        }
      >
        <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
        <line x1="22" x2="22" y1="11" y2="13" />
        <rect
          x="4"
          y="9"
          width={fillWidth}
          height="6"
          rx="0.5"
          fill="currentColor"
          stroke="none"
        />
        {charging && (
          <path
            d="M11 7L8 12H11L8 17"
            fill="currentColor"
            stroke="none"
            className="text-white drop-shadow-md"
            transform="translate(1, 0)"
          />
        )}
      </svg>
    </div>
  );

  const batteryItems: MenuItem[] = [
    { label: "Battery", shortcut: `${percentage}%`, disabled: true },
    {
      label: `Power Source: ${charging ? "Power Adapter" : "Battery"}`,
      disabled: true,
    },
    { separator: true },
    { label: "Energy Mode", disabled: true },
    { label: "Automatic", disabled: true }, // Simplified for UI demo
    { label: "Low Power", disabled: true },
    { label: "High Power", disabled: true },
    { separator: true },
    { label: "Using Significant Energy", disabled: true },
    { label: "Antigravity", icon: "🅰️" }, // Example app
    { separator: true },
    { label: "Battery Settings..." },
  ];

  return <MenuButton id="battery" label={batteryIcon} items={batteryItems} />;
};

const WeatherDisplay = () => {
  const { weather, loading } = useWeather();
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  if (loading || !weather) {
    return (
      <div className="flex items-center gap-1.5 opacity-90 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
        <Cloud size={16} strokeWidth={2} className="text-white/90" />
        <span>--°</span>
      </div>
    );
  }

  return (
    <>
      <div
        ref={ref}
        className={`flex items-center gap-1.5 opacity-90 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default ${
          isOpen ? "bg-white/20" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <weather.current.icon size={16} className="text-white/90" />
        <span>{weather.current.temp}°</span>
      </div>
      <WeatherDropdown
        weather={weather}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        toggleRef={ref}
      />
    </>
  );
};

import { ControlCenter } from "./ControlCenter";

export const MenuBar: React.FC = () => {
  const { activeApp, toggleNotificationCenter } = useSystemStore();
  const { launchProcess } = useProcessStore();
  const [isControlCenterOpen, setIsControlCenterOpen] = React.useState(false);
  const controlCenterRef = React.useRef<HTMLDivElement>(null);

  // --- MENU CONFIGURATIONS ---

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
        <WeatherDisplay />

        {/* Media */}
        <div className="opacity-90 hover:bg-white/10 p-1 rounded cursor-default">
          <PlayCircle size={16} strokeWidth={2} />
        </div>

        {/* Battery */}
        <BatteryDisplay />

        {/* Wifi */}
        <WifiDisplay />

        {/* Search */}
        <div
          className="opacity-90 hover:bg-white/10 p-1 rounded cursor-default active:bg-white/20"
          onClick={() => useSystemStore.getState().toggleSpotlight()}
        >
          <Search size={15} strokeWidth={2.5} />
        </div>

        {/* Control Center */}
        <div
          ref={controlCenterRef}
          className={`opacity-90 hover:bg-white/10 p-1 rounded cursor-default ${
            isControlCenterOpen ? "bg-white/20" : ""
          }`}
          onClick={() => setIsControlCenterOpen(!isControlCenterOpen)}
        >
          <ControlCenterIcon />
        </div>

        {/* Siri */}
        <div className="opacity-90 hover:bg-white/10 p-1 rounded cursor-default">
          <SiriIcon />
        </div>

        {/* Clock */}
        <div
          id="menu-bar-clock"
          className="opacity-90 hover:bg-white/10 px-2 py-0.5 rounded cursor-default active:bg-white/20"
          onClick={toggleNotificationCenter}
        >
          <Clock />
        </div>
      </div>

      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        toggleRef={controlCenterRef}
      />
    </header>
  );
};
