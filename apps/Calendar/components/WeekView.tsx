import React from "react";
import { CALENDARS } from "../constants";
import { CalendarEvent } from "../types";
import { useTranslations } from "next-intl";

interface WeekViewProps {
  currentDate: Date;
  isSameDay: (d1: Date, d2: Date) => boolean;
  getEventsForDay: (date: Date) => CalendarEvent[];
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  isSameDay,
  getEventsForDay,
}) => {
  const t = useTranslations("Calendar");
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const weekdayKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="grid grid-cols-8 border-b border-gray-200 dark:border-white/10 sticky top-0 bg-white dark:bg-[#1e1e1e] z-10">
        <div className="w-12 border-r border-gray-200 dark:border-white/10"></div>
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={`py-2 text-center border-r border-gray-200 dark:border-white/10 ${
              isSameDay(day, new Date())
                ? "text-red-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <div className="text-xs font-medium">
              {t(`WeekdaysShort.${weekdayKeys[day.getDay()]}`)}
            </div>
            <div
              className={`text-xl font-light w-8 h-8 mx-auto flex items-center justify-center rounded-full ${
                isSameDay(day, new Date()) ? "bg-red-500 text-white" : ""
              }`}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 relative" style={{ height: "1440px" }}>
          {/* Time Column */}
          <div className="border-r border-gray-200 dark:border-white/10 text-xs text-gray-400 text-right pr-2 pt-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-[60px] -mt-2.5">
                {i === 0
                  ? ""
                  : `${i > 12 ? i - 12 : i} ${i >= 12 ? "PM" : "AM"}`}
              </div>
            ))}
          </div>
          {/* Days Columns */}
          {weekDays.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="border-r border-gray-200 dark:border-white/10 relative"
            >
              {/* Grid Lines */}
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[60px] border-b border-gray-100 dark:border-white/5 w-full absolute top-0"
                  style={{ top: `${i * 60}px` }}
                />
              ))}

              {/* Events */}
              {getEventsForDay(day).map((event) => {
                const startHour =
                  event.start.getHours() + event.start.getMinutes() / 60;
                const duration =
                  (event.end.getTime() - event.start.getTime()) /
                  (1000 * 60 * 60);
                return (
                  <div
                    key={event.id}
                    className={`absolute left-0.5 right-0.5 rounded px-2 py-1 text-xs text-white overflow-hidden ${
                      CALENDARS.find((c) => c.id === event.calendarId)?.color
                    }`}
                    style={{
                      top: `${startHour * 60}px`,
                      height: `${Math.max(20, duration * 60)}px`,
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${t("EventLabel", {
                      title: event.title,
                      location: event.location || "",
                    })}`}
                  >
                    <div className="font-semibold">{event.title}</div>
                    <div>{event.location}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
