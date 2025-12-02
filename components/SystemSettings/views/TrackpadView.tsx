import React from "react";
import { MousePointer2 } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const TrackpadView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <MousePointer2 size={32} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Trackpad</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Change trackpad settings.
          </p>
        </div>
      </div>

      <div className="flex justify-center py-2 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          <button className="px-4 py-1 rounded-md bg-white dark:bg-gray-600 shadow-sm text-sm font-medium dark:text-white">
            Point & Click
          </button>
          <button className="px-4 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
            Scroll & Zoom
          </button>
          <button className="px-4 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
            More Gestures
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <SettingsGroup>
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
              <span className="text-[13px] font-medium dark:text-gray-200">
                Tracking speed
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">Slow</span>
                <input type="range" className="w-24 accent-blue-500" />
                <span className="text-[10px] text-gray-400">Fast</span>
              </div>
            </div>
            <SettingsRow label="Click" value="Medium" />
            <SettingsRow
              label="Force Click and haptic feedback"
              type="toggle"
              value={true}
              isLast
            />
          </SettingsGroup>
          <SettingsGroup>
            <SettingsRow
              label="Look up & data detectors"
              type="toggle"
              value={true}
            />
            <SettingsRow
              label="Secondary click"
              value="Click with two fingers"
            />
            <SettingsRow
              label="Tap to click"
              type="toggle"
              value={true}
              isLast
            />
          </SettingsGroup>
        </div>
        <div className="w-1/3 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm aspect-4/3">
          Video Preview
        </div>
      </div>
    </div>
  );
};
