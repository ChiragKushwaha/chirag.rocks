import React from "react";
import { useReminderStore } from "../../store/reminderStore";
import { useTranslations } from "next-intl";

interface RemindersWidgetProps {
  size: "small" | "medium" | "large";
}

export const RemindersWidget: React.FC<RemindersWidgetProps> = () => {
  const t = useTranslations("Widgets.Reminders");
  const { reminders, toggleReminder } = useReminderStore();
  const due = reminders.slice(0, 4);

  return (
    <div className="flex flex-col p-3.5 h-full bg-white dark:bg-[#1c1c1e] text-black dark:text-white select-none justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Big Sur Reminders 3-dot bullet icon */}
          <div className="w-5 h-5 rounded-full bg-[#007AFF] flex items-center justify-center shadow-xs">
            <div className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-white" />
              <span className="w-1 h-1 rounded-full bg-white/80" />
            </div>
          </div>
          <span className="font-semibold text-[13px] text-gray-900 dark:text-gray-100">
            {t("Title") || "Reminders"}
          </span>
        </div>
        <span className="text-[12px] font-bold text-[#007AFF]">
          {reminders.filter((r) => !r.completed).length}
        </span>
      </div>

      <div className="space-y-2 my-auto">
        {due.length === 0 ? (
          <div className="text-[12px] text-gray-400 py-2">
            {t("NoReminders") || "No Reminders"}
          </div>
        ) : (
          due.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2.5 text-[12px] group py-0.5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleReminder(r.id);
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReminder(r.id);
                }}
                className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                  r.completed
                    ? "bg-[#007AFF] border-[#007AFF]"
                    : "border-gray-400 dark:border-gray-500 hover:border-[#007AFF]"
                }`}
                aria-label={`Toggle reminder ${r.text}`}
              >
                {r.completed && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span
                className={`truncate transition-all ${
                  r.completed
                    ? "line-through text-gray-400 dark:text-gray-500"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {r.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
