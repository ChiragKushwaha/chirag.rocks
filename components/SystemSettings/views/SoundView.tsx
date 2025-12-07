import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const SoundView = () => {
  const t = useTranslations("SystemSettings.Sound");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Volume2 size={32} className="text-pink-500" />
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

      <SettingsGroup title={t("OutputInput")}>
        <div className="flex justify-center py-2 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button className="px-4 py-1 rounded-md bg-white dark:bg-gray-600 shadow-sm text-sm font-medium dark:text-white">
              {t("Output")}
            </button>
            <button className="px-4 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("Input")}
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs font-medium text-gray-500 mb-2">
            {t("SelectOutput")}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-center gap-3">
                <Volume2 size={16} className="text-gray-500" />
                <span className="text-sm dark:text-white">{t("Speakers")}</span>
              </div>
              <span className="text-xs text-gray-500">{t("BuiltIn")}</span>
            </div>
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            {t("OutputVolume")}
          </span>
          <div className="flex items-center gap-2">
            <VolumeX size={14} className="text-gray-400" />
            <input type="range" className="w-32 accent-blue-500" />
            <Volume2 size={18} className="text-gray-400" />
          </div>
        </div>
        <SettingsRow label={t("Mute")} type="toggle" value={false} />
        <SettingsRow label={t("ShowInMenuBar")} value={t("Always")} isLast />
      </SettingsGroup>

      <SettingsGroup title={t("AlertSoundGroup")}>
        <SettingsRow label={t("AlertSound")} value={t("Boop")} />
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            {t("AlertVolume")}
          </span>
          <input type="range" className="w-32 accent-blue-500" />
        </div>
        <SettingsRow
          label={t("PlayUIEffects")}
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
