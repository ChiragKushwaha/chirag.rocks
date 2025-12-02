import React from "react";
import { HardDrive, Info } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const StorageView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <HardDrive size={32} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Storage</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage disk space.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <HardDrive size={24} className="text-gray-500" />
            </div>
            <div>
              <div className="font-semibold dark:text-white">Macintosh HD</div>
              <div className="text-sm text-gray-500">
                245 GB available of 494 GB
              </div>
            </div>
          </div>
        </div>

        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex mb-4">
          <div className="w-[30%] bg-red-500" />
          <div className="w-[15%] bg-yellow-500" />
          <div className="w-[10%] bg-green-500" />
          <div className="w-[5%] bg-blue-500" />
          <div className="w-[5%] bg-purple-500" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Apps</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Documents</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>System Data</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>macOS</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Other Users</span>
          </div>
        </div>
      </div>

      <SettingsGroup title="Recommendations">
        <div className="p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
            <Info size={20} />
          </div>
          <div className="flex-1">
            <div className="font-medium dark:text-white mb-1">
              Store in iCloud
            </div>
            <div className="text-sm text-gray-500 mb-3">
              Store all your files, photos and messages in iCloud and save space
              on this Mac.
            </div>
            <button className="px-3 py-1 text-xs font-medium bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-600 rounded shadow-sm dark:text-gray-200">
              Store in iCloud...
            </button>
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Categories">
        <SettingsRow label="Applications" value="120 GB" />
        <SettingsRow label="Documents" value="45 GB" />
        <SettingsRow label="System Data" value="30 GB" />
        <SettingsRow label="macOS" value="15 GB" isLast />
      </SettingsGroup>
    </div>
  );
};
