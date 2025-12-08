import React from "react";
import { MapPin } from "lucide-react";
import { CALENDARS } from "../constants";
import { CalendarEvent } from "../types";
import { useTranslations } from "next-intl";

interface DayViewProps {
  currentDate: Date;
  getEventsForDay: (date: Date) => CalendarEvent[];
}

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  getEventsForDay,
}) => {
  const t = useTranslations("Calendar.Event");
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-white/10 sticky top-0 bg-white dark:bg-[#1e1e1e] z-10">
        <div className="text-red-500 font-medium text-sm">
          {currentDate.toLocaleDateString("en-US", {
            weekday: "long",
          })}
        </div>
        <div className="text-3xl font-light">{currentDate.getDate()}</div>
      </div>
      {/* Reuse week view logic but for single day */}
      <div className="flex-1 relative" style={{ height: "1440px" }}>
        <div className="absolute left-0 w-16 border-r border-gray-200 dark:border-white/10 h-full bg-gray-50/50 dark:bg-white/5">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="h-[60px] border-b border-transparent text-xs text-gray-400 text-right pr-2 pt-2"
            >
              {i === 0 ? "" : `${i > 12 ? i - 12 : i} ${i >= 12 ? "PM" : "AM"}`}
            </div>
          ))}
        </div>
        <div className="ml-16 relative h-full">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="h-[60px] border-b border-gray-100 dark:border-white/5 w-full absolute top-0"
              style={{ top: `${i * 60}px` }}
            />
          ))}
          {getEventsForDay(currentDate).map((event) => {
            const startHour =
              event.start.getHours() + event.start.getMinutes() / 60;
            const duration =
              (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
            return (
              <div
                key={event.id}
                className={`absolute left-2 right-2 rounded px-3 py-2 text-sm text-white overflow-hidden ${
                  CALENDARS.find((c) => c.id === event.calendarId)?.color
                }`}
                style={{
                  top: `${startHour * 60}px`,
                  height: `${Math.max(30, duration * 60)}px`,
                }}
                role="button"
                tabIndex={0}
                aria-label={`Event: ${event.title} at ${
                  event.location || t("NoLocation")
                }`}
              >
                <div className="font-semibold">{event.title}</div>
                <div className="opacity-90 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin size={10} /> {event.location || t("NoLocation")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
