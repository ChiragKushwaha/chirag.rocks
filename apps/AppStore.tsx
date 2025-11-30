import React from "react";
import {
  Search,
  Gamepad2,
  LayoutGrid,
  PenTool,
  Layers,
  User,
} from "lucide-react";

export const AppStore: React.FC = () => {
  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-60 bg-[#f5f5f7] dark:bg-[#2b2b2b] border-r border-gray-200 dark:border-black/20 flex flex-col p-4">
        <div className="relative mb-6">
          <Search
            size={14}
            className="absolute left-2.5 top-1.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-200 dark:bg-black/20 border-none rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-gray-200 dark:bg-white/10 text-blue-500">
            <LayoutGrid size={18} />
            <span className="text-sm font-medium">Discover</span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
            <Gamepad2 size={18} />
            <span className="text-sm">Arcade</span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
            <PenTool size={18} />
            <span className="text-sm">Create</span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
            <Layers size={18} />
            <span className="text-sm">Work</span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
            <Gamepad2 size={18} />
            <span className="text-sm">Play</span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-3 px-2 py-3 border-t border-gray-200 dark:border-black/10 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/5 rounded-md">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <User size={16} className="text-gray-500 dark:text-gray-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Chirag</span>
            <span className="text-xs text-gray-500">Account</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Discover</h1>

        {/* Featured Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="snap-center flex-shrink-0 w-[400px] aspect-[16/9] rounded-xl bg-gray-200 dark:bg-gray-800 relative overflow-hidden group cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  i === 1
                    ? "from-blue-500 to-purple-600"
                    : i === 2
                    ? "from-green-500 to-teal-600"
                    : "from-orange-500 to-red-600"
                }`}
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                    Featured App
                  </span>
                  <h2 className="text-2xl font-bold mt-1">App Title {i}</h2>
                  <p className="text-sm opacity-90 mt-1">
                    The best app for doing things.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700/50 my-6" />

        <h2 className="text-xl font-bold mb-4">Essential Apps</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-lg -mx-2"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 ${
                    i % 2 === 0
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-purple-100 dark:bg-purple-900"
                  }`}
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-base">Awesome App {i}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Productivity
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button className="px-5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-blue-500 font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/20">
                  GET
                </button>
                <span className="text-[10px] text-gray-400">
                  In-App Purchases
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
