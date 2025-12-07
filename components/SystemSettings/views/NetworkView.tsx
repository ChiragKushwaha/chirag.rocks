import React from "react";
import {
  Globe,
  Wifi,
  Shield,
  ChevronRight,
  Cable,
  Zap,
  MoreHorizontal,
  HelpCircle,
} from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { useTranslations } from "next-intl";

export const NetworkView = () => {
  const t = useTranslations("SystemSettings.Network");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#007AFF] flex items-center justify-center">
          <Globe size={32} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            {t("Title")}
          </h2>
        </div>
      </div>

      <SettingsGroup>
        <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#007AFF] flex items-center justify-center text-white">
              <Wifi size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium dark:text-gray-200">
                {t("WiFi")}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[11px] text-gray-500">
                  {t("Connected")}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </div>

        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#FF9500] flex items-center justify-center text-white">
              <Shield size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium dark:text-gray-200">
                {t("Firewall")}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className="text-[11px] text-gray-500">
                  {t("Inactive")}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </div>
      </SettingsGroup>

      <SettingsGroup title={t("OtherServices")}>
        {[
          { name: "USB 10/100/1000 LAN", icon: Cable, color: "red" },
          { name: "USB 10/100/1G/2.5G LAN", icon: Cable, color: "red" },
          { name: "Thunderbolt Bridge", icon: Zap, color: "red" },
        ].map((service, i) => (
          <div
            key={service.name}
            className={`flex items-center justify-between p-3 ${
              i !== 2 ? "border-b border-gray-100 dark:border-gray-700/50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-gray-400 flex items-center justify-center text-white">
                <service.icon size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium dark:text-gray-200">
                  {service.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      service.color === "green" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-[11px] text-gray-500">
                    {t("NotConnected")}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight size={14} className="text-gray-400" />
          </div>
        ))}
      </SettingsGroup>

      <div className="flex justify-end gap-2">
        <button className="w-8 h-6 flex items-center justify-center bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-600 rounded shadow-sm text-gray-500">
          <MoreHorizontal size={14} />
        </button>
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
          <HelpCircle size={14} />
        </div>
      </div>
    </div>
  );
};
