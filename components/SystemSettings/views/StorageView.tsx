import React, { useState, useEffect } from "react";
import { HardDrive, Info } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const StorageView = () => {
  const t = useTranslations("SystemSettings.Storage");
  const [storageData, setStorageData] = useState({
    totalGB: 494,
    availableGB: 245,
    usedGB: 249,
    appsGB: 120,
    docsGB: 45,
    systemGB: 30,
    macosGB: 15,
  });

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.storage?.estimate) {
      navigator.storage.estimate().then((est) => {
        if (est.quota) {
          const quotaGB = Math.round((est.quota / (1024 * 1024 * 1024)) * 10) / 10;
          const usageGB = Math.round(((est.usage || 0) / (1024 * 1024 * 1024)) * 10) / 10;
          const availGB = Math.max(0, Math.round((quotaGB - usageGB) * 10) / 10);
          setStorageData((prev) => ({
            ...prev,
            totalGB: quotaGB > 10 ? Math.round(quotaGB) : 494,
            availableGB: availGB > 1 ? Math.round(availGB) : 245,
            usedGB: Math.round(usageGB),
          }));
        }
      }).catch(() => {});
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full shrink-0 aspect-square shadow-sm bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <HardDrive size={32} className="text-gray-500" />
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

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shrink-0 aspect-square">
              <HardDrive size={24} className="text-gray-500" />
            </div>
            <div>
              <div className="font-semibold dark:text-white">
                {t("MacintoshHD")}
              </div>
              <div className="text-sm text-gray-500">
                {t("AvailableSpace", { available: storageData.availableGB, total: storageData.totalGB })}
              </div>
            </div>
          </div>
        </div>

        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex mb-4">
          <div className="w-[30%] bg-red-500" />
          <div className="w-[15%] bg-yellow-500" />
          <div className="w-[10%] bg-green-500" />
          <div className="w-[5%] bg-blue-500" />
          <div className="w-[5%] bg-purple-500" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>{t("Apps")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>{t("Documents")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>{t("SystemData")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{t("macOS")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>{t("OtherUsers")}</span>
          </div>
        </div>
      </div>

      <SettingsGroup title={t("Recommendations")}>
        <div className="p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
            <Info size={20} />
          </div>
          <div className="flex-1">
            <div className="font-medium dark:text-white mb-1">
              {t("StoreInICloud")}
            </div>
            <div className="text-sm text-gray-500 mb-3">
              {t("StoreInICloudDesc")}
            </div>
            <button className="px-3 py-1 text-xs font-medium bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-600 rounded shadow-sm dark:text-gray-200">
              {t("StoreInICloudButton")}
            </button>
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t("Categories")}>
        <SettingsRow label={t("Applications")} value="120 GB" />
        <SettingsRow label={t("Documents")} value="45 GB" />
        <SettingsRow label={t("SystemData")} value="30 GB" />
        <SettingsRow label={t("macOS")} value="15 GB" isLast />
      </SettingsGroup>
    </div>
  );
};
