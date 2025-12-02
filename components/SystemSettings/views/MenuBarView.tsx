import React from "react";
import { Layout } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const MenuBarView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Layout size={32} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Menu Bar</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Change menu bar settings.
          </p>
        </div>
      </div>

      <SettingsGroup>
        <SettingsRow
          label="Automatically hide and show the menu bar"
          value="Never"
        />
        <SettingsRow
          label="Recent documents, applications and servers"
          value="None"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="Menu Bar Controls">
        <SettingsRow label="Control Center" value="Show in Menu Bar" />
        <SettingsRow label="Siri" value="Don't Show in Menu Bar" />
        <SettingsRow label="Spotlight" value="Show in Menu Bar" />
        <SettingsRow
          label="Play feedback when volume is changed"
          type="toggle"
          value={false}
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
