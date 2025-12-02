import React from "react";
import { Keyboard } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const KeyboardView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Keyboard size={32} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Keyboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Change keyboard settings.
          </p>
        </div>
      </div>

      <SettingsGroup>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            Key Repeat
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Slow</span>
            <input type="range" className="w-32 accent-blue-500" />
            <span className="text-[10px] text-gray-400">Fast</span>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            Delay Until Repeat
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Long</span>
            <input type="range" className="w-32 accent-blue-500" />
            <span className="text-[10px] text-gray-400">Short</span>
          </div>
        </div>
        <SettingsRow
          label="Adjust keyboard brightness in low light"
          type="toggle"
          value={true}
        />
        <SettingsRow label="Keyboard navigation" type="toggle" value={false} />
        <div className="px-4 py-3 flex justify-end">
          <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
            Keyboard Shortcuts...
          </button>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Text Input">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium dark:text-gray-200">
              Input Sources
            </div>
            <div className="text-[11px] text-gray-500">ABC</div>
          </div>
          <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
            Edit...
          </button>
        </div>
        <SettingsRow label="Dictation" type="toggle" value={true} isLast />
      </SettingsGroup>
    </div>
  );
};
