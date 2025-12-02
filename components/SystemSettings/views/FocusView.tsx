import React from "react";
import { Moon, Plus } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const FocusView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Moon size={32} className="text-indigo-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Focus</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a Focus to customize its settings.
          </p>
        </div>
      </div>

      <SettingsGroup>
        <SettingsRow label="Do Not Disturb" type="toggle" value={false} />
        <SettingsRow label="Share across devices" type="toggle" value={true} />
        <SettingsRow label="Focus Status" value="On" isLast />
      </SettingsGroup>

      <SettingsGroup title="Focus Modes">
        <SettingsRow label="Do Not Disturb" value="Off" />
        <SettingsRow label="Personal" value="Set Up" />
        <SettingsRow label="Sleep" value="Off" />
        <SettingsRow label="Work" value="Set Up" isLast />
      </SettingsGroup>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
          <Plus size={14} />
          <span>Add Focus</span>
        </button>
      </div>
    </div>
  );
};
