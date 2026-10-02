import React from "react";
import { useLocale } from "next-intl";

interface CalendarWidgetProps {
  size: "small" | "medium" | "large";
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ size }) => {
  const locale = useLocale();
  const today = new Date();
  const weekday = today.toLocaleDateString(locale, { weekday: "short" }).toUpperCase();
  const dayNumber = today.getDate();

  if (size === "small") {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#1c1c1e] text-black dark:text-white select-none p-3.5 justify-between">
        <div>
          <div className="text-[12px] font-bold text-[#FF3B30] tracking-wider">{weekday}</div>
          <div className="text-[44px] font-extralight leading-none mt-1 text-gray-900 dark:text-gray-50">{dayNumber}</div>
        </div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate border-t border-black/5 dark:border-white/10 pt-1.5">
          No more events today
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1c1c1e] text-black dark:text-white select-none p-4 justify-between">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-[13px] font-bold text-[#FF3B30] tracking-wider mr-2">{weekday}</span>
          <span className="text-[14px] font-semibold text-gray-800 dark:text-gray-200">
            {today.toLocaleDateString(locale, { month: "long", day: "numeric" })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 my-auto">
        <div className="text-[48px] font-extralight leading-none text-gray-900 dark:text-gray-50">{dayNumber}</div>
        <div className="flex-1 space-y-1.5 border-l-2 border-[#007AFF] pl-3">
          <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">Project Review</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">11:00 AM – 12:00 PM</div>
        </div>
      </div>
    </div>
  );
};
