import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const renderCalendarGrid = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = startDayOfMonth(currentDate);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border-b border-r border-gray-200 dark:border-gray-700/50 bg-gray-50/30 dark:bg-white/5"
        />
      );
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      const isToday =
        i === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      const isSelected =
        i === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();

      days.push(
        <div
          key={i}
          onClick={() =>
            setSelectedDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
            )
          }
          className={`h-24 border-b border-r border-gray-200 dark:border-gray-700/50 p-2 relative group transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
            isSelected ? "bg-blue-50/50 dark:bg-blue-500/10" : ""
          }`}
        >
          <span
            className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${
              isToday
                ? "bg-red-500 text-white"
                : isSelected
                ? "bg-blue-500 text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {i}
          </span>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-60 bg-gray-50 dark:bg-[#2b2b2b] border-r border-gray-200 dark:border-black/20 flex flex-col p-4">
        <div className="flex items-center justify-between mb-6">
          <span className="font-semibold text-lg dark:text-gray-200">
            Calendars
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
              ICLOUD
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Home</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm">Work</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Family</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
              OTHER
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm">Birthdays</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-sm">Holidays</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 dark:border-black/20 flex items-center justify-between px-4 bg-white dark:bg-[#1e1e1e]">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold dark:text-white">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h1>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-0.5">
              <button
                onClick={prevMonth}
                className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-2 text-sm font-medium"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 text-xs font-medium">
              <button className="px-3 py-1 rounded-md bg-white dark:bg-gray-600 shadow-sm">
                Month
              </button>
              <button className="px-3 py-1 rounded-md hover:bg-white/50 dark:hover:bg-gray-600/50">
                Week
              </button>
              <button className="px-3 py-1 rounded-md hover:bg-white/50 dark:hover:bg-gray-600/50">
                Day
              </button>
            </div>
            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700/50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700/50 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr">
            {renderCalendarGrid()}
          </div>
        </div>
      </div>
    </div>
  );
};
