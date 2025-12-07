import React from "react";
import { Layout } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

export const DesktopDockView = () => {
  const t = useTranslations("SystemSettings.DesktopDock");

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

      <SettingsGroup title={t("Dock")}>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            {t("Size")}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{t("Small")}</span>
            <input
              type="range"
              className="w-32 accent-blue-500"
              aria-label="Icon size"
            />
            <span className="text-[10px] text-gray-400">{t("Large")}</span>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200">
            {t("Magnification")}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{t("Small")}</span>
            <input
              type="range"
              className="w-32 accent-blue-500"
              aria-label="Dock size"
            />
            <span className="text-[10px] text-gray-400">{t("Large")}</span>
          </div>
        </div>
        <SettingsRow label={t("Position")} value={t("Bottom")} />
        <SettingsRow label={t("MinimiseUsing")} value={t("GenieEffect")} />
        <SettingsRow label={t("DoubleClickTitle")} value={t("Zoom")} />
        <SettingsRow label={t("MinimiseToIcon")} type="toggle" value={false} />
        <SettingsRow label={t("AutoHideDock")} type="toggle" value={false} />
        <SettingsRow label={t("AnimateOpening")} type="toggle" value={true} />
        <SettingsRow label={t("ShowIndicators")} type="toggle" value={true} />
        <SettingsRow
          label={t("ShowRecent")}
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title={t("DesktopStageManager")}>
        <SettingsRow label={t("ShowItems")} value={t("OnDesktop")} />
        <SettingsRow label={t("ClickWallpaper")} value={t("Always")} />
        <SettingsRow
          label={t("StageManager")}
          type="toggle"
          value={false}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title={t("Widgets")}>
        <SettingsRow label={t("ShowWidgets")} value={t("OnDesktop")} />
        <SettingsRow label={t("WidgetStyle")} value={t("Automatic")} />
        <SettingsRow
          label={t("UseIPhoneWidgets")}
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
