import React from "react";
import { Keyboard } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const KeyboardView = () => {
  const t = useTranslations("SystemSettings.Keyboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Keyboard size={32} className="text-gray-500" />
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

      <SettingsGroup>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            {t("KeyRepeat")}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{t("Slow")}</span>
            <input type="range" className="w-32 accent-blue-500" />
            <span className="text-[10px] text-gray-400">{t("Fast")}</span>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            {t("DelayUntilRepeat")}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{t("Long")}</span>
            <input type="range" className="w-32 accent-blue-500" />
            <span className="text-[10px] text-gray-400">{t("Short")}</span>
          </div>
        </div>
        <SettingsRow label={t("AdjustBrightness")} type="toggle" value={true} />
        <SettingsRow
          label={t("KeyboardNavigation")}
          type="toggle"
          value={false}
        />
        <div className="px-4 py-3 flex justify-end">
          <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
            {t("Shortcuts")}
          </button>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t("TextInput")}>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium dark:text-gray-200">
              {t("InputSources")}
            </div>
            <div className="text-[11px] text-gray-500">ABC</div>
          </div>
          <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
            {t("Edit")}
          </button>
        </div>
        <SettingsRow label={t("Dictation")} type="toggle" value={true} isLast />
      </SettingsGroup>
    </div>
  );
};
