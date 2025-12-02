import React from "react";
import { Search } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const SpotlightView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Search size={32} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Spotlight</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Search on your Mac.
          </p>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <div className="w-96 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center px-4 gap-2 opacity-50">
          <Search size={20} className="text-gray-500" />
          <span className="text-gray-500">Spotlight Search</span>
        </div>
      </div>

      <SettingsGroup title="Search Results">
        {[
          "Applications",
          "Calculator",
          "Contacts",
          "Conversion",
          "Definition",
          "Developer",
          "Documents",
          "Events & Reminders",
          "Folders",
          "Fonts",
          "Images",
          "Mail & Messages",
          "Movies",
          "Music",
          "Other",
          "PDF Documents",
          "Presentations",
          "Siri Suggestions",
          "Spreadsheets",
          "System Preferences",
          "Tips",
          "Bookmarks & History",
        ].map((item, i, arr) => (
          <SettingsRow
            key={item}
            label={item}
            type="toggle"
            value={true}
            isLast={i === arr.length - 1}
          />
        ))}
      </SettingsGroup>

      <div className="flex justify-end">
        <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
          Spotlight Privacy...
        </button>
      </div>
    </div>
  );
};
