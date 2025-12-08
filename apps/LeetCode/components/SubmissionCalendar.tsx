import React from "react";
import { ChevronRight } from "lucide-react";
import { LeetCodeData } from "../types";

interface SubmissionCalendarProps {
  matchedUser: LeetCodeData["matchedUser"];
}

import { useTranslations, useLocale } from "next-intl";

interface SubmissionCalendarProps {
  matchedUser: LeetCodeData["matchedUser"];
}

export const SubmissionCalendar: React.FC<SubmissionCalendarProps> = ({
  matchedUser,
}) => {
  const t = useTranslations("LeetCode.Calendar");
  const locale = useLocale();

  const renderHeatmap = (calendarJson: string) => {
    const calendar = JSON.parse(calendarJson);
    const today = new Date();
    const yearAgo = new Date();
    yearAgo.setFullYear(today.getFullYear() - 1);

    // Generate weeks
    const weeks = [];
    const current = new Date(yearAgo);
    // Align to Sunday
    current.setDate(current.getDate() - current.getDay());

    while (current <= today) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        let count = 0;
        // Check if any timestamp in calendar matches this day
        const dateStr = current.toDateString();
        Object.keys(calendar).forEach((ts) => {
          if (new Date(parseInt(ts) * 1000).toDateString() === dateStr) {
            count = calendar[ts];
          }
        });

        week.push({ date: new Date(current), count });
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    return (
      <div className="flex gap-[3px] overflow-hidden">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {week.map((day, j) => (
              <div
                key={j}
                className={`w-[11px] h-[11px] rounded-[2px] ${
                  day.count === 0
                    ? "bg-[#3c3c3c]/50"
                    : day.count < 3
                    ? "bg-[#005328]" // Dark green
                    : day.count < 6
                    ? "bg-[#00833e]" // Medium green
                    : "bg-[#00b254]" // Bright green
                }`}
                title={`${day.date.toLocaleDateString(locale)}: ${
                  day.count
                } submissions`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getMonthLabels = () => {
    const today = new Date();
    const labels = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push(d.toLocaleString(locale, { month: "short" }));
    }
    return labels;
  };

  return (
    <div className="bg-[#282828] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-lg">
            {JSON.parse(matchedUser.submissionCalendar)
              ? Object.values(
                  JSON.parse(matchedUser.submissionCalendar) as Record<
                    string,
                    number
                  >
                ).reduce((a: number, b: number) => a + b, 0)
              : 0}
          </span>
          <span className="text-gray-400 text-sm">
            {t("SubmissionsLastYear")}
          </span>
          <div className="text-gray-500 cursor-help">ⓘ</div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>
            {t("TotalActiveDays")}{" "}
            <span className="text-white font-medium">
              {Object.keys(JSON.parse(matchedUser.submissionCalendar)).length}
            </span>
          </span>
          <span>
            {t("MaxStreak")} <span className="text-white font-medium">64</span>
          </span>
          <div className="bg-[#3c3c3c] px-3 py-1.5 rounded text-white flex items-center gap-2 cursor-pointer hover:bg-[#4c4c4c]">
            {t("Current")} <ChevronRight size={12} className="rotate-90" />
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        {renderHeatmap(matchedUser.submissionCalendar)}
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
        {getMonthLabels().map((month, i) => (
          <span key={i}>{month}</span>
        ))}
      </div>
    </div>
  );
};
