import React from "react";
import { MousePointer2 } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const TrackpadView = () => {
  const t = useTranslations("SystemSettings.Trackpad");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <MousePointer2 size={32} className="text-gray-500" />
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

      <div className="flex justify-center py-2 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          <button className="px-4 py-1 rounded-md bg-white dark:bg-gray-600 shadow-sm text-sm font-medium dark:text-white">
            {t("PointClick")}
          </button>
          <button className="px-4 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("ScrollZoom")}
          </button>
          <button className="px-4 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("MoreGestures")}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <SettingsGroup>
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
              <span className="text-[13px] font-medium dark:text-gray-200">
                {t("TrackingSpeed")}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">{t("Slow")}</span>
                <input type="range" className="w-24 accent-blue-500" />
                <span className="text-[10px] text-gray-400">{t("Fast")}</span>
              </div>
            </div>
            <SettingsRow label={t("Click")} value={t("Medium")} />
            <SettingsRow
              label={t("ForceClick")}
              type="toggle"
              value={true}
              isLast
            />
          </SettingsGroup>
          <SettingsGroup>
            <SettingsRow label={t("LookUp")} type="toggle" value={true} />
            <SettingsRow
              label={t("SecondaryClick")}
              value={t("ClickTwoFingers")}
            />
            <SettingsRow
              label={t("TapToClick")}
              type="toggle"
              value={true}
              isLast
            />
          </SettingsGroup>
        </div>
        <div className="w-1/3 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm aspect-4/3">
          {t("VideoPreview")}
        </div>
      </div>
    </div>
  );
};
