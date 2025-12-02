import React from "react";
import { Eye } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useSystemStore } from "../../../store/systemStore";

export const AppearanceView = () => {
  const { theme, setTheme } = useSystemStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Eye size={24} className="text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Appearance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select your preferred appearance.
          </p>
        </div>
      </div>

      <SettingsGroup title="Appearance">
        <div className="flex gap-8 py-2">
          <button
            onClick={() => setTheme("light")}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`w-20 h-14 rounded-lg bg-[#f5f5f5] border shadow-sm flex items-center justify-center relative overflow-hidden ${
                theme === "light" ? "border-gray-400" : "border-gray-200"
              }`}
            >
              <div className="absolute inset-0 bg-white" />
              <div className="absolute top-0 left-0 right-0 h-3 bg-gray-200" />
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xs dark:text-gray-300">Light</span>
            {theme === "light" && (
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setTheme("dark")}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`w-20 h-14 rounded-lg bg-[#1e1e1e] border shadow-sm flex items-center justify-center relative overflow-hidden ${
                theme === "dark" ? "border-gray-400" : "border-gray-600"
              }`}
            >
              <div className="absolute inset-0 bg-[#2b2b2b]" />
              <div className="absolute top-0 left-0 right-0 h-3 bg-[#3a3a3a]" />
            </div>
            <span className="text-xs dark:text-gray-300">Dark</span>
            {theme === "dark" && (
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setTheme("auto")}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`w-20 h-14 rounded-lg bg-linear-to-r from-[#f5f5f5] to-[#1e1e1e] border shadow-sm flex items-center justify-center relative overflow-hidden ${
                theme === "auto"
                  ? "border-gray-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-white to-[#2b2b2b]" />
              <div className="absolute top-0 left-0 right-0 h-3 bg-linear-to-r from-gray-200 to-[#3a3a3a]" />
            </div>
            <span className="text-xs dark:text-gray-300">Auto</span>
            {theme === "auto" && (
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
            )}
          </button>
        </div>
      </SettingsGroup>

      <SettingsGroup>
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50">
          <span className="text-sm dark:text-white">Accent colour</span>
          <div className="flex gap-2">
            {[
              "#FF3B30",
              "#FF9500",
              "#FFCC00",
              "#34C759",
              "#007AFF",
              "#AF52DE",
              "#FF2D55",
              "#8E8E93",
            ].map((c, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full cursor-pointer ring-1 ring-black/5 dark:ring-white/10"
                style={{ backgroundColor: c }}
              ></div>
            ))}
          </div>
        </div>
        <SettingsRow label="Highlight colour" value="Automatic" />
        <SettingsRow label="Sidebar icon size" value="Medium" />
        <SettingsRow
          label="Allow wallpaper tinting in windows"
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="Show scroll bars">
        <div className="space-y-2 py-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="scroll"
              id="scroll-auto"
              defaultChecked
              className="text-blue-500"
            />
            <label htmlFor="scroll-auto" className="text-sm dark:text-gray-300">
              Automatically based on mouse or trackpad
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="scroll"
              id="scroll-scrolling"
              className="text-blue-500"
            />
            <label
              htmlFor="scroll-scrolling"
              className="text-sm dark:text-gray-300"
            >
              When scrolling
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="scroll"
              id="scroll-always"
              className="text-blue-500"
            />
            <label
              htmlFor="scroll-always"
              className="text-sm dark:text-gray-300"
            >
              Always
            </label>
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Click in the scroll bar to">
        <div className="space-y-2 py-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="click"
              id="click-next"
              defaultChecked
              className="text-blue-500"
            />
            <label htmlFor="click-next" className="text-sm dark:text-gray-300">
              Jump to the next page
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="click"
              id="click-spot"
              className="text-blue-500"
            />
            <label htmlFor="click-spot" className="text-sm dark:text-gray-300">
              Jump to the spot that's clicked
            </label>
          </div>
        </div>
      </SettingsGroup>
    </div>
  );
};
