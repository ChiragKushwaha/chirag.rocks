import React from "react";
import { Lock } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const LockScreenView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Lock size={32} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Lock Screen</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Change Lock Screen settings.
          </p>
        </div>
      </div>

      <SettingsGroup>
        <SettingsRow
          label="Turn display off on battery when inactive"
          value="2 minutes"
        />
        <SettingsRow
          label="Turn display off on power adapter when inactive"
          value="10 minutes"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow
          label="Require password after screen saver begins or display is turned off"
          value="Immediately"
        />
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            Show message when locked
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-6 rounded-full p-1 transition-colors bg-gray-300 dark:bg-gray-600`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm`} />
            </div>
            <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
              Set...
            </button>
          </div>
        </div>
        <SettingsRow label="Login window shows" value="List of users" />
        <SettingsRow label="Show large clock" value="On Lock Screen" isLast />
      </SettingsGroup>
    </div>
  );
};
