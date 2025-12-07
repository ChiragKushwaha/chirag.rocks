import React from "react";
import { Layout } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const MenuBarView = () => {
  const t = useTranslations("SystemSettings.MenuBar");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Layout size={32} className="text-gray-500" />
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
        <SettingsRow label={t("AutoHide")} value={t("Never")} />
        <SettingsRow label={t("RecentDocs")} value={t("None")} isLast />
      </SettingsGroup>

      <SettingsGroup title={t("Controls")}>
        <SettingsRow label={t("ControlCenter")} value={t("ShowInMenuBar")} />
        <SettingsRow label={t("Siri")} value={t("DontShowInMenuBar")} />
        <SettingsRow label={t("Spotlight")} value={t("ShowInMenuBar")} />
        <SettingsRow
          label={t("VolumeFeedback")}
          type="toggle"
          value={false}
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
