import React from "react";
import { CALENDARS } from "../constants";
import { CalendarEvent } from "../types";
import { useTranslations } from "next-intl";

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setShowEventModal: (show: boolean) => void;
  daysInMonth: (date: Date) => number;
  startDayOfMonth: (date: Date) => number;
  isSameDay: (d1: Date, d2: Date) => boolean;
  getEventsForDay: (date: Date) => CalendarEvent[];
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  setShowEventModal,
  daysInMonth,
  startDayOfMonth,
  isSameDay,
  getEventsForDay,
}) => {
  const t = useTranslations("Calendar");
  const totalDays = daysInMonth(currentDate);
  const startDay = startDayOfMonth(currentDate);
  const days = [];

  // Empty cells
  for (let i = 0; i < startDay; i++) {
    days.push(
      <div
        key={`empty-${i}`}
        className="min-h-[100px] border-b border-r border-gray-200 dark:border-white/10 bg-gray-50/30 dark:bg-white/5"
      />
    );
  }

  // Days
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    const isToday = isSameDay(date, new Date());
    const isSelected = isSameDay(date, selectedDate);
    const dayEvents = getEventsForDay(date);

    days.push(
      <div
        key={i}
        onClick={() => setSelectedDate(date)}
        onDoubleClick={() => {
          setSelectedDate(date);
          setShowEventModal(true);
        }}
        className={`min-h-[100px] border-b border-r border-gray-200 dark:border-white/10 p-1 relative group transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
          isSelected ? "bg-blue-50/50 dark:bg-blue-500/10" : ""
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setSelectedDate(date);
            // Optional: Trigger modal on Enter if already selected?
            // For now just select.
          }
        }}
        aria-label={date.toDateString()}
        aria-pressed={isSelected}
      >
        <div className="flex justify-center">
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
        <div className="mt-1 space-y-1">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                CALENDARS.find((c) => c.id === event.calendarId)?.color
              } text-white opacity-90`}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1e1e1e]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-white/10 last:border-r-0"
          >
            {t(`Weekdays.${day}`)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-fr flex-1 overflow-y-auto">
        {days}
      </div>
    </div>
  );
};
