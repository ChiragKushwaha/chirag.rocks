import React from "react";
import {
  Bluetooth,
  Keyboard,
  Mouse,
  Speaker,
  Headphones,
  Info,
} from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { Toggle } from "../../Toggle";
import { useTranslations } from "next-intl";

export const BluetoothView = () => {
  const t = useTranslations("SystemSettings.Bluetooth");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#007AFF] flex items-center justify-center">
            <Bluetooth size={32} className="text-white" />
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
        <Toggle checked={true} onChange={() => {}} />
      </div>

      <div className="text-xs text-gray-500 px-2">{t("Discoverable")}</div>

      <SettingsGroup title={t("MyDevices")}>
        <SettingsRow
          icon={Keyboard}
          label="Magic Keyboard"
          value={t("NotConnected")}
          color="#8E8E93"
        >
          <Info size={16} className="text-gray-400" />
        </SettingsRow>
        <SettingsRow
          icon={Mouse}
          label="Magic Mouse"
          value={t("NotConnected")}
          color="#8E8E93"
        >
          <Info size={16} className="text-gray-400" />
        </SettingsRow>
        <SettingsRow
          icon={Speaker}
          label="Bose Revolve SoundLink"
          value={t("NotConnected")}
          color="#8E8E93"
        >
          <Info size={16} className="text-gray-400" />
        </SettingsRow>
        <SettingsRow
          icon={Headphones}
          label="Chirag's Buds2 Pro"
          value={t("NotConnected")}
          color="#8E8E93"
          isLast
        >
          <Info size={16} className="text-gray-400" />
        </SettingsRow>
      </SettingsGroup>

      <div className="flex items-center justify-between px-2 mb-2">
        <span className="text-xs font-semibold text-gray-500">
          {t("NearbyDevices")}
        </span>
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></div>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 p-8 flex items-center justify-center text-gray-400 text-sm">
        {t("Searching")}
      </div>
    </div>
  );
};
