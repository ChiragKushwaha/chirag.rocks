import React from "react";
import { Search, Navigation, Map as MapIcon, Info, Locate } from "lucide-react";

export const Maps: React.FC = () => {
  return (
    <div className="flex h-full bg-[#f5f5f7] dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans relative overflow-hidden">
      {/* Sidebar */}
      <div className="absolute top-4 left-4 w-80 bg-white/90 dark:bg-[#2b2b2b]/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-black/10 z-10 flex flex-col max-h-[calc(100%-32px)]">
        <div className="p-3 border-b border-gray-200 dark:border-black/10">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Maps"
              className="w-full bg-gray-100 dark:bg-black/20 border-none rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2 mt-2">
            FAVORITES
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Navigation size={16} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Home</span>
                <span className="text-xs text-gray-500">Add Address</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                <MapIcon size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Work</span>
                <span className="text-xs text-gray-500">Add Address</span>
              </div>
            </div>
          </div>

          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2 mt-4">
            RECENT
          </h3>
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            No recent searches
          </div>
        </div>
      </div>

      {/* Map Area (Placeholder) */}
      <div className="w-full h-full bg-[#e5e3df] dark:bg-[#242f3e] relative flex items-center justify-center">
        {/* Grid pattern to simulate map */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="text-center opacity-50">
          <MapIcon size={64} className="mx-auto mb-4 text-gray-500" />
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            Map View
          </h2>
          <p className="text-gray-500">
            Map data not available in offline mode
          </p>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-md flex items-center justify-center text-blue-500 hover:bg-gray-50">
            <Locate size={20} />
          </button>
          <button className="w-10 h-10 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-md flex items-center justify-center text-gray-500 hover:bg-gray-50">
            <Info size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
