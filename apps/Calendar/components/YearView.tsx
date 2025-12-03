import React from "react";
import { ViewMode, CalendarEvent } from "../types";

interface YearViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setView: (view: ViewMode) => void;
  daysInMonth: (date: Date) => number;
  startDayOfMonth: (date: Date) => number;
  isSameDay: (d1: Date, d2: Date) => boolean;
  getEventsForDay: (date: Date) => CalendarEvent[];
}

export const YearView: React.FC<YearViewProps> = ({
  currentDate,
  setCurrentDate,
  setView,
  daysInMonth,
  startDayOfMonth,
  isSameDay,
  getEventsForDay,
}) => {
  const months = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="grid grid-cols-4 gap-4 p-4 overflow-y-auto h-full">
      {months.map((month) => {
        const date = new Date(currentDate.getFullYear(), month, 1);
        const days = daysInMonth(date);
        const start = startDayOfMonth(date);

        return (
          <div
            key={month}
            className="bg-gray-50 dark:bg-white/5 rounded-lg p-2 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => {
              setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
              setView("month");
            }}
          >
            <div className="text-red-500 font-semibold mb-2 text-sm">
              {date.toLocaleString("default", { month: "long" })}
            </div>
            <div className="grid grid-cols-7 text-[10px] gap-y-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={`${d}-${i}`} className="text-gray-400 text-center">
                  {d}
                </div>
              ))}
              {Array.from({ length: start }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: days }).map((_, i) => {
                const dayDate = new Date(
                  currentDate.getFullYear(),
                  month,
                  i + 1
                );
                const isToday = isSameDay(dayDate, new Date());
                const hasEvents = getEventsForDay(dayDate).length > 0;
                return (
                  <div
                    key={i}
                    className={`text-center relative ${
                      isToday
                        ? "text-red-500 font-bold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {i + 1}
                    {hasEvents && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-gray-400 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
