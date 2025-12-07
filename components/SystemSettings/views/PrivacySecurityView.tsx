import React from "react";
import { Lock, MapPin, Camera, Mic, Folder, Eye, Shield } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const PrivacySecurityView = () => {
  const t = useTranslations("SystemSettings.PrivacySecurity");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Lock size={24} className="text-white" />
          </div>
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

      <SettingsGroup title={t("Privacy")}>
        <SettingsRow
          icon={MapPin}
          label={t("LocationServices")}
          value={t("On")}
          color="#007AFF"
        />
        <SettingsRow
          icon={Camera}
          label={t("Camera")}
          value={t("AppsCount", { count: 0 })}
          color="#007AFF"
        />
        <SettingsRow
          icon={Mic}
          label={t("Microphone")}
          value={t("AppsCount", { count: 2 })}
          color="#007AFF"
        />
        <SettingsRow
          icon={Folder}
          label={t("FilesFolders")}
          value={t("AppsCount", { count: 5 })}
          color="#007AFF"
        />
        <SettingsRow
          icon={Eye}
          label={t("ScreenRecording")}
          value={t("AppsCount", { count: 1 })}
          color="#007AFF"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title={t("Security")}>
        <SettingsRow label={t("FileVault")} value={t("On")} />
        <SettingsRow label={t("LockdownMode")} value={t("Off")} isLast />
      </SettingsGroup>

      <SettingsGroup title={t("Others")}>
        <SettingsRow icon={Shield} label={t("Extensions")} color="#8E8E93" />
        <SettingsRow
          icon={Shield}
          label={t("Profiles")}
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
