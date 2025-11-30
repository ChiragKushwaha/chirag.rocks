import React from "react";
import { useSystemStore } from "../store/systemStore";
import { useMenuStore, MenuItem } from "../store/menuStore";
import { useProcessStore } from "../store/processStore";
import { TopDropdown } from "./Menus";
import { AboutMac } from "../apps/AboutMac";
import { Clock } from "./Clock";

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
      className="h-[28px] bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 text-white shadow-sm fixed top-0 w-full z-[8000] select-none"
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
      <div className="flex items-center gap-5 px-2 text-[13px] font-medium">
        <span className="opacity-90">🔋 100%</span>
        <Clock />
      </div>
    </header>
  );
};
