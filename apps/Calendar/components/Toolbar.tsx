import React from "react";
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { ViewMode } from "../types";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Calendar.Toolbar");
  return (
    <div className="h-[52px] border-b border-gray-200/70 dark:border-black/20 flex items-center justify-between px-5 bg-white dark:bg-[#1e1e1e] shrink-0 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif]">
      {/* Left section */}
      <div className="flex items-center gap-5">
        <div className="flex items-center bg-gray-100 dark:bg-black/20 rounded-md p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
          <button
            onClick={() => navigate("prev")}
            className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-[5px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Previous period"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-[12px] font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 rounded-[5px] transition-colors"
            aria-label="Go to today"
          >
            {t("Today")}
          </button>
          <button
            onClick={() => navigate("next")}
            className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-[5px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Next period"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
        <h1 className="text-[17px] font-bold text-gray-900 dark:text-white min-w-[160px] leading-none">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* View Segmented Control */}
        <div className="flex items-center bg-gray-100 dark:bg-black/20 rounded-md p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
          {(["day", "week", "month", "year"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-[12px] font-medium rounded-[5px] transition-all capitalize ${
                view === v
                  ? "bg-white dark:bg-[#4a4a4a] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {t(`View.${v}`)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isSearching ? (
            <div className="flex items-center bg-gray-100 dark:bg-black/20 rounded-md px-2 py-1 w-48 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder={t("SearchPlaceholder")}
                className="bg-transparent border-none outline-none text-[13px] text-gray-900 dark:text-white ml-2 w-full placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t("SearchPlaceholder")}
              />
              <button
                onClick={() => {
                  setIsSearching(false);
                  setSearchQuery("");
                }}
                className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearching(true)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              aria-label="Search"
            >
              <Search size={16} strokeWidth={2} />
            </button>
          )}

          <button
            onClick={() => setShowEventModal(true)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            aria-label="New event"
          >
            <Plus size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};
