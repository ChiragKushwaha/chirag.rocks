import React from "react";
import { Fingerprint, Plus } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const TouchIDPasswordView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Fingerprint size={32} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            Touch ID & Password
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add a fingerprint to unlock your Mac.
          </p>
        </div>
      </div>

      <SettingsGroup title="Touch ID">
        <div className="p-4 flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-600">
              <Fingerprint size={24} className="text-gray-400" />
            </div>
            <span className="text-xs font-medium dark:text-gray-300">
              Finger 1
            </span>
          </div>
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 group-hover:border-gray-400 transition-colors">
              <Plus size={24} className="text-gray-400" />
            </div>
            <span className="text-xs font-medium text-blue-500">
              Add Fingerprint
            </span>
          </button>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Use Touch ID for">
        <SettingsRow label="Unlocking your Mac" type="toggle" value={true} />
        <SettingsRow label="Apple Pay" type="toggle" value={true} />
        <SettingsRow
          label="iTunes Store, App Store & Apple Books"
          type="toggle"
          value={true}
        />
        <SettingsRow
          label="AutoFill Passwords"
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="Password">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium dark:text-gray-200">
              Password
            </div>
            <div className="text-[11px] text-gray-500">
              Last changed: 24/11/2024
            </div>
          </div>
          <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
            Change...
          </button>
        </div>
        <SettingsRow
          label="Require password after screen saver begins or display is turned off"
          value="Immediately"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="Apple Watch">
        <SettingsRow
          label="Use your Apple Watch to unlock your applications and your Mac"
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
