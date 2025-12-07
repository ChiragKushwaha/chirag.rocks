import React from "react";
import { Hourglass } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const ScreenTimeView = () => {
  const t = useTranslations("SystemSettings.ScreenTime");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Hourglass size={32} className="text-purple-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            {t("Title")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("Description")}
          </p>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <div className="w-full h-48 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-sm text-gray-500">{t("DailyAverage")}</div>
              <div className="text-2xl font-semibold dark:text-white">
                2h 15m
              </div>
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1">
              <span>▼ 12% {t("FromLastWeek")}</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-2 pt-4">
            {[40, 60, 30, 80, 50, 20, 45].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 pt-1">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>
        </div>
      </div>

      <SettingsGroup>
        <SettingsRow label={t("Downtime")} value={t("Off")} />
        <SettingsRow
          label={t("AppLimits")}
          value={t("LimitsCount", { count: 0 })}
        />
        <SettingsRow label={t("AlwaysAllowed")} value={t("AllowedApps")} />
        <SettingsRow label={t("ContentPrivacy")} value={t("On")} isLast />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow
          label={t("ShareAcrossDevices")}
          type="toggle"
          value={true}
        />
        <SettingsRow
          label={t("LockSettings")}
          type="toggle"
          value={false}
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
