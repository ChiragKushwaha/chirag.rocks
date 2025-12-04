import React from "react";
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { ViewMode } from "../types";

interface ToolbarProps {
  currentDate: Date;
  navigate: (direction: "prev" | "next") => void;
  setCurrentDate: (date: Date) => void;
  view: ViewMode;
  setView: (view: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  setShowEventModal: (show: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentDate,
  navigate,
  setCurrentDate,
  view,
  setView,
  searchQuery,
  setSearchQuery,
  isSearching,
  setIsSearching,
  setShowEventModal,
}) => {
  return (
    <div className="h-14 border-b border-gray-200 dark:border-black/20 flex items-center justify-between px-4 bg-white dark:bg-[#1e1e1e] shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold dark:text-white min-w-[160px]">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-0.5 shadow-inner">
          <button
            onClick={() => navigate("prev")}
            className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm transition-all"
            aria-label="Previous period"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 text-sm font-medium hover:bg-white dark:hover:bg-gray-600 rounded mx-0.5 transition-all"
            aria-label="Go to today"
          >
            Today
          </button>
          <button
            onClick={() => navigate("next")}
            className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm transition-all"
            aria-label="Next period"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 text-xs font-medium shadow-inner">
          {(["day", "week", "month", "year"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-md transition-all capitalize ${
                view === v
                  ? "bg-white dark:bg-gray-600 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-gray-600/50"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1" />

        {isSearching ? (
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1">
            <Search size={14} className="text-gray-500 mr-2" />
            <input
              type="text"
              autoFocus
              placeholder="Search events..."
              className="bg-transparent border-none outline-none text-sm w-32 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search events"
            />
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchQuery("");
              }}
              className="ml-1 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsSearching(true)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        )}

        <button
          onClick={() => setShowEventModal(true)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          aria-label="New event"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};
