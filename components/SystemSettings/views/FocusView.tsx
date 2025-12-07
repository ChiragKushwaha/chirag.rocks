import React from "react";
import { Moon, Plus } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const FocusView = () => {
  const t = useTranslations("SystemSettings.Focus");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Moon size={32} className="text-indigo-500" />
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
        <SettingsRow label={t("DoNotDisturb")} type="toggle" value={false} />
        <SettingsRow
          label={t("ShareAcrossDevices")}
          type="toggle"
          value={true}
        />
        <SettingsRow label={t("FocusStatus")} value={t("On")} isLast />
      </SettingsGroup>

      <SettingsGroup title={t("FocusModes")}>
        <SettingsRow label={t("DoNotDisturb")} value={t("Off")} />
        <SettingsRow label={t("Personal")} value={t("SetUp")} />
        <SettingsRow label={t("Sleep")} value={t("Off")} />
        <SettingsRow label={t("Work")} value={t("SetUp")} isLast />
      </SettingsGroup>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
          <Plus size={14} />
          <span>{t("AddFocus")}</span>
        </button>
      </div>
    </div>
  );
};
