import React from "react";
import { Monitor } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const DisplaysView = () => {
  const t = useTranslations("SystemSettings.Displays");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Monitor size={32} className="text-gray-500" />
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
        <div className="relative w-48 h-32 bg-gray-800 rounded-t-xl border-4 border-gray-300 dark:border-gray-600 border-b-0 flex items-center justify-center">
          <div className="w-full h-full bg-linear-to-b from-blue-400 to-blue-600 opacity-80"></div>
          <span className="absolute text-white text-xs font-medium drop-shadow-md">
            {t("BuiltInDisplay")}
          </span>
        </div>
      </div>

      <SettingsGroup title={t("BuiltInDisplay")}>
        <SettingsRow label={t("UseAs")} value={t("MainDisplay")} />
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex justify-between mb-2">
            <span className="text-[13px] font-medium dark:text-gray-200">
              {t("Resolution")}
            </span>
            <span className="text-[13px] text-gray-500">{t("Default")}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <div className="shrink-0 w-24 h-16 border rounded bg-gray-50 dark:bg-white/5 flex items-center justify-center text-xs dark:text-gray-300">
              {t("MoreSpace")}
            </div>
            <div className="shrink-0 w-24 h-16 border-2 border-blue-500 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
              {t("Default")}
            </div>
            <div className="shrink-0 w-24 h-16 border rounded bg-gray-50 dark:bg-white/5 flex items-center justify-center text-xs dark:text-gray-300">
              {t("LargerText")}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            {t("Brightness")}
          </span>
          <input type="range" className="w-32 accent-blue-500" />
        </div>
        <SettingsRow label={t("TrueTone")} type="toggle" value={true} />
        <SettingsRow label={t("Preset")} value={t("Preset")} />
        <SettingsRow label={t("RefreshRate")} value={t("ProMotion")} isLast />
      </SettingsGroup>

      <div className="flex justify-end">
        <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
          {t("Advanced")}
        </button>
      </div>
    </div>
  );
};
