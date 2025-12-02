import React from "react";
import { Hourglass } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const ScreenTimeView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Hourglass size={32} className="text-purple-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Screen Time</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor usage and set limits.
          </p>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <div className="w-full h-48 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-sm text-gray-500">Daily Average</div>
              <div className="text-2xl font-semibold dark:text-white">
                2h 15m
              </div>
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1">
              <span>▼ 12% from last week</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-2 pt-4">
            {[40, 60, 30, 80, 50, 20, 45].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 pt-1">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>
        </div>
      </div>

      <SettingsGroup>
        <SettingsRow label="Downtime" value="Off" />
        <SettingsRow label="App Limits" value="0 limits" />
        <SettingsRow label="Always Allowed" value="Phone, Maps, Messages" />
        <SettingsRow label="Content & Privacy" value="On" isLast />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow label="Share across devices" type="toggle" value={true} />
        <SettingsRow
          label="Lock Screen Time Settings"
          type="toggle"
          value={false}
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
