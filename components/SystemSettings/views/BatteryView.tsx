import React from "react";
import { Battery, Zap, Info } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const BatteryView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Battery size={32} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Battery</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Check battery health and usage.
          </p>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <div className="w-full h-48 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-sm text-gray-500">Battery Level</div>
              <div className="text-2xl font-semibold dark:text-white">85%</div>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Zap size={12} className="text-yellow-500" />
              <span>Last charged to 100% today at 8:00 AM</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-1 pt-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-green-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${Math.random() * 80 + 20}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 pt-1">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
          </div>
        </div>
      </div>

      <SettingsGroup>
        <SettingsRow label="Low Power Mode" value="Never" />
        <SettingsRow label="Battery Health" value="Normal">
          <Info size={14} className="text-blue-500" />
        </SettingsRow>
        <SettingsRow
          label="Optimised Battery Charging"
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>

      <div className="flex justify-end">
        <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
          Options...
        </button>
      </div>
    </div>
  );
};
