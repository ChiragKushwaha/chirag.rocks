import React from "react";
import { Users, User, Info } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const UsersGroupsView = () => {
  const t = useTranslations("SystemSettings.UsersGroups");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Users size={32} className="text-blue-500" />
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

      <SettingsGroup title={t("CurrentUser")}>
        <div className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl overflow-hidden">
            🦅
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium dark:text-white">
              Chirag Kushwaha
            </div>
            <div className="text-xs text-gray-500">{t("Admin")}</div>
          </div>
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t("OtherUsers")}>
        <div className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
            <User size={24} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium dark:text-white">
              {t("GuestUser")}
            </div>
            <div className="text-xs text-gray-500">{t("Off")}</div>
          </div>
          <Info size={16} className="text-gray-400" />
        </div>
      </SettingsGroup>

      <div className="flex justify-end">
        <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
          {t("AddAccount")}
        </button>
      </div>

      <SettingsGroup>
        <SettingsRow label={t("AutoLogin")} value={t("Off")} />
        <SettingsRow label={t("AllowNetworkUsers")} value={t("Off")} isLast />
      </SettingsGroup>
    </div>
  );
};
