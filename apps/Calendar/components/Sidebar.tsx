import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CALENDARS } from "../constants";
import { useTranslations } from "next-intl";

interface SidebarProps {
  currentDate: Date;
}

function getMiniCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export const Sidebar: React.FC<SidebarProps> = ({ currentDate }) => {
  const t = useTranslations("Calendar.Sidebar");
  const today = new Date();

  const [miniDate, setMiniDate] = useState(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );

  const prevMiniMonth = () =>
    setMiniDate(new Date(miniDate.getFullYear(), miniDate.getMonth() - 1, 1));
  const nextMiniMonth = () =>
    setMiniDate(new Date(miniDate.getFullYear(), miniDate.getMonth() + 1, 1));

  const { firstDay, daysInMonth } = getMiniCalendarDays(
    miniDate.getFullYear(),
    miniDate.getMonth()
  );

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isToday = (d: number) =>
    d === today.getDate() &&
    miniDate.getMonth() === today.getMonth() &&
    miniDate.getFullYear() === today.getFullYear();

  const isSelected = (d: number) =>
    d === currentDate.getDate() &&
    miniDate.getMonth() === currentDate.getMonth() &&
    miniDate.getFullYear() === currentDate.getFullYear();

  return (
    <div className="w-[220px] bg-[#f5f5f7] dark:bg-[#272727] border-r border-gray-200/70 dark:border-black/25 flex flex-col shrink-0">
      {/* ── TODAY BADGE ── */}
      <div className="px-4 pt-4 pb-3">
        <div className="w-full bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200/60 dark:border-white/8 flex flex-col items-center justify-center py-3">
          <div className="text-red-500 font-bold text-[11px] uppercase tracking-widest">
            {today.toLocaleString("default", { month: "short" })}
          </div>
          <div className="text-[44px] font-thin text-gray-800 dark:text-gray-100 leading-none my-1">
            {today.getDate()}
          </div>
          <div className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
            {today.toLocaleString("default", { weekday: "long" })}
          </div>
        </div>
      </div>

      {/* ── MINI MONTH CALENDAR ── */}
      <div className="px-3 pb-3">
        {/* Mini calendar header */}
        <div className="flex items-center justify-between mb-2 px-1">
          <button
            onClick={prevMiniMonth}
            className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronLeft size={13} strokeWidth={2.5} />
          </button>
          <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
            {miniDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <button
            onClick={nextMiniMonth}
            className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-semibold text-gray-400 pb-0.5">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {blanks.map((_, i) => (
            <div key={`b-${i}`} />
          ))}
          {days.map((d) => (
            <button
              key={d}
              className={`w-full aspect-square flex items-center justify-center rounded-full text-[11px] transition-colors ${
                isToday(d)
                  ? "bg-red-500 text-white font-bold"
                  : isSelected(d) && !isToday(d)
                  ? "bg-[#007AFF]/15 text-[#007AFF] font-semibold"
                  : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* ── CALENDARS LIST ── */}
      <div className="px-3 flex-1 overflow-y-auto">
        <div className="mb-3">
          <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 px-1">
            {t("iCloud")}
          </h3>
          <div className="space-y-0.5">
            {CALENDARS.slice(0, 3).map((cal) => (
              <div
                key={cal.id}
                className="flex items-center gap-2.5 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-default transition-colors"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${cal.color} shrink-0`} />
                <span className="text-[12px] text-gray-700 dark:text-gray-300">{cal.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 px-1">
            {t("Other")}
          </h3>
          <div className="space-y-0.5">
            {CALENDARS.slice(3).map((cal) => (
              <div
                key={cal.id}
                className="flex items-center gap-2.5 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-default transition-colors"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${cal.color} shrink-0`} />
                <span className="text-[12px] text-gray-700 dark:text-gray-300">{cal.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invitations section */}
      <div className="px-3 py-3 border-t border-gray-200/50 dark:border-black/20">
        <div className="bg-gray-100 dark:bg-white/5 rounded-lg py-2.5 px-3 text-[11px] text-gray-400 dark:text-gray-500 text-center">
          {t("NoInvitations")}
        </div>
      </div>
    </div>
  );
};
