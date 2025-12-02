import React from "react";
import { Monitor, Clock } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const ScreenSaverView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Monitor size={32} className="text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            Screen Saver
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose a screen saver.
          </p>
        </div>
      </div>

      <div className="flex gap-6 items-center px-4">
        <div className="w-48 aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden relative border border-gray-300 dark:border-gray-600 shadow-sm shrink-0 flex items-center justify-center">
          <span className="text-xs text-gray-500">Preview</span>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-2">
          <h3 className="font-medium dark:text-white">Ventura</h3>
          <SettingsRow label="Show on all Spaces" type="toggle" value={true} />
        </div>
      </div>

      <SettingsGroup title="Screen Savers">
        <div className="grid grid-cols-4 gap-4 p-4">
          {[
            "Ventura",
            "Monterey",
            "Big Sur",
            "Catalina",
            "Hello",
            "Drift",
            "Flurry",
            "Shell",
          ].map((name) => (
            <div key={name} className="flex flex-col gap-1">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg border border-transparent hover:border-blue-500 cursor-pointer transition-colors"></div>
              <span className="text-xs text-center dark:text-gray-300">
                {name}
              </span>
            </div>
          ))}
        </div>
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow label="Start after" value="5 minutes" />
        <SettingsRow
          label="Show with clock"
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
