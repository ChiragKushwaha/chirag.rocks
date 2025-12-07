import React from "react";
import { Printer, ChevronRight } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { useTranslations } from "next-intl";

export const PrintersScannersView = () => {
  const t = useTranslations("SystemSettings.PrintersScanners");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Printer size={32} className="text-gray-500" />
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

      <SettingsGroup title={t("Printers")}>
        <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
          <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-500">
            <Printer size={24} className="text-gray-500 dark:text-gray-300" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium dark:text-white">
              HP LaserJet Pro
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              {t("IdleLastUsed")}
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
        <div className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-500">
            <Printer size={24} className="text-gray-500 dark:text-gray-300" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium dark:text-white">
              Canon PIXMA
            </div>
            <div className="text-xs text-gray-500">{t("Offline")}</div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </SettingsGroup>

      <div className="flex justify-end">
        <button className="text-[13px] font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-white/10 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 shadow-sm">
          {t("AddPrinter")}
        </button>
      </div>
    </div>
  );
};
