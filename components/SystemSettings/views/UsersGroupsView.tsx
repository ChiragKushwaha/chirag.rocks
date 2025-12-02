import React from "react";
import { Users, User, Info } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const UsersGroupsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Users size={32} className="text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            Users & Groups
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage user accounts and groups.
          </p>
        </div>
      </div>

      <SettingsGroup title="Current User">
        <div className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl overflow-hidden">
            🦅
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium dark:text-white">
              Chirag Kushwaha
            </div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Other Users">
        <div className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
            <User size={24} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium dark:text-white">
              Guest User
            </div>
            <div className="text-xs text-gray-500">Off</div>
          </div>
          <Info size={16} className="text-gray-400" />
        </div>
      </SettingsGroup>

      <div className="flex justify-end">
        <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
          Add Account...
        </button>
      </div>

      <SettingsGroup>
        <SettingsRow label="Automatically login as" value="Off" />
        <SettingsRow
          label="Allow network users to log in at login window"
          value="Off"
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
