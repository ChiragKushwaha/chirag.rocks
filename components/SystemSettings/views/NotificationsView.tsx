import React from "react";
import { Bell } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const NotificationsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Bell size={32} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            Notifications
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Control how notifications are displayed.
          </p>
        </div>
      </div>

      <SettingsGroup>
        <div className="p-4 flex gap-4 items-start">
          <div className="w-1/3 bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center text-gray-400 text-xs">
            Preview
          </div>
          <div className="flex-1 space-y-4">
            <SettingsRow label="Show previews" value="Always" isLast />
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Application Notifications">
        {[
          "App Store",
          "Calendar",
          "FaceTime",
          "Mail",
          "Messages",
          "Photos",
          "Reminders",
          "Safari",
        ].map((app, i, arr) => (
          <SettingsRow
            key={app}
            label={app}
            type="toggle"
            value={true}
            isLast={i === arr.length - 1}
          />
        ))}
      </SettingsGroup>
    </div>
  );
};
