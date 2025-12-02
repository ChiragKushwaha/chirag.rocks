import React from "react";
import { Layout } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const DesktopDockView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Layout size={32} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            Desktop & Dock
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Change the appearance of the Dock and Desktop.
          </p>
        </div>
      </div>

      <SettingsGroup title="Dock">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            Size
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Small</span>
            <input type="range" className="w-32 accent-blue-500" />
            <span className="text-[10px] text-gray-400">Large</span>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            Magnification
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Small</span>
            <input type="range" className="w-32 accent-blue-500" />
            <span className="text-[10px] text-gray-400">Large</span>
          </div>
        </div>
        <SettingsRow label="Position on screen" value="Bottom" />
        <SettingsRow label="Minimise windows using" value="Genie effect" />
        <SettingsRow
          label="Double-click a window's title bar to"
          value="Zoom"
        />
        <SettingsRow
          label="Minimise windows into application icon"
          type="toggle"
          value={false}
        />
        <SettingsRow
          label="Automatically hide and show the Dock"
          type="toggle"
          value={false}
        />
        <SettingsRow
          label="Animate opening applications"
          type="toggle"
          value={true}
        />
        <SettingsRow
          label="Show indicators for open applications"
          type="toggle"
          value={true}
        />
        <SettingsRow
          label="Show recent applications in Dock"
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="Desktop & Stage Manager">
        <SettingsRow label="Show Items" value="On Desktop" />
        <SettingsRow label="Click wallpaper to reveal desktop" value="Always" />
        <SettingsRow label="Stage Manager" type="toggle" value={false} isLast />
      </SettingsGroup>

      <SettingsGroup title="Widgets">
        <SettingsRow label="Show Widgets" value="On Desktop" />
        <SettingsRow label="Widget style" value="Automatic" />
        <SettingsRow
          label="Use iPhone widgets"
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
