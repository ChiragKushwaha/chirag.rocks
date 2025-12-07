import React from "react";
import { Fingerprint, Plus } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useSystemStore } from "../../../store/systemStore";
import { useTranslations } from "next-intl";

export const TouchIDPasswordView = () => {
  const { idleTimeoutSeconds, setIdleTimeoutSeconds } = useSystemStore();
  const t = useTranslations("SystemSettings.TouchIDPassword");

  const timeoutOptions = [
    { label: t("Never"), value: 0 },
    { label: t("Seconds", { count: 15 }), value: 15 },
    { label: t("Seconds", { count: 30 }), value: 30 },
    { label: t("Minute", { count: 1 }), value: 60 },
    { label: t("Minutes", { count: 2 }), value: 120 },
    { label: t("Minutes", { count: 5 }), value: 300 },
    { label: t("Minutes", { count: 10 }), value: 600 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Fingerprint size={32} className="text-red-500" />
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

      <SettingsGroup title={t("TouchID")}>
        <div className="p-4 flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-600">
              <Fingerprint size={24} className="text-gray-400" />
            </div>
            <span className="text-xs font-medium dark:text-gray-300">
              {t("Finger1")}
            </span>
          </div>
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 group-hover:border-gray-400 transition-colors">
              <Plus size={24} className="text-gray-400" />
            </div>
            <span className="text-xs font-medium text-blue-500">
              {t("AddFingerprint")}
            </span>
          </button>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t("UseTouchIDFor")}>
        <SettingsRow label={t("UnlockingMac")} type="toggle" value={true} />
        <SettingsRow label={t("ApplePay")} type="toggle" value={true} />
        <SettingsRow label={t("iTunesAppStore")} type="toggle" value={true} />
        <SettingsRow
          label={t("AutoFillPasswords")}
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title={t("Password")}>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium dark:text-gray-200">
              {t("Password")}
            </div>
            <div className="text-[11px] text-gray-500">{t("LastChanged")}</div>
          </div>
          <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
            {t("Change")}
          </button>
        </div>
        <SettingsRow
          label={t("RequirePasswordScreenSaver")}
          value={t("Immediately")}
        />
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-[13px] font-medium dark:text-gray-200">
            {t("RequirePasswordIdle")}
          </div>
          <select
            value={idleTimeoutSeconds}
            onChange={(e) => setIdleTimeoutSeconds(Number(e.target.value))}
            className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {timeoutOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t("AppleWatch")}>
        <SettingsRow
          label={t("AppleWatchUnlock")}
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
