import React from "react";
import { CALENDARS } from "../constants";

interface SidebarProps {
  currentDate: Date;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentDate }) => {
  return (
    <div className="w-60 bg-gray-50/90 dark:bg-[#2b2b2b]/90 backdrop-blur-xl border-r border-gray-200 dark:border-black/20 flex flex-col p-4 pt-8">
      <div className="mb-6">
        <div className="w-full aspect-square bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center mb-4">
          <div className="text-red-500 font-bold text-xl">
            {currentDate
              .toLocaleString("default", { month: "short" })
              .toUpperCase()}
          </div>
          <div className="text-5xl font-light text-gray-800 dark:text-gray-100">
            {currentDate.getDate()}
          </div>
          <div className="text-gray-500 dark:text-gray-400 font-medium">
            {currentDate.toLocaleString("default", { weekday: "long" })}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
            ICLOUD
          </h3>
          <div className="space-y-1">
            {CALENDARS.slice(0, 3).map((cal) => (
              <div
                key={cal.id}
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full ${cal.color} shadow-sm`}
                />
                <span className="text-sm">{cal.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
            OTHER
          </h3>
          <div className="space-y-1">
            {CALENDARS.slice(3).map((cal) => (
              <div
                key={cal.id}
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full ${cal.color} shadow-sm`}
                />
                <span className="text-sm">{cal.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="bg-gray-200 dark:bg-white/10 rounded-lg p-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          No invitations
        </div>
      </div>
    </div>
  );
};
