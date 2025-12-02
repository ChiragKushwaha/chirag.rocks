import React, { useState } from "react";
import { Wifi, Lock, MoreHorizontal, HelpCircle } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { Toggle } from "../../Toggle";

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 3L4.5 8.5L2 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const WifiView = () => {
  const [wifiEnabled, setWifiEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#007AFF] flex items-center justify-center">
            <Wifi size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold dark:text-white">Wi-Fi</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Set up Wi-Fi to wirelessly connect your Mac to the internet.
            </p>
          </div>
        </div>
        <Toggle checked={wifiEnabled} onChange={setWifiEnabled} />
      </div>

      {wifiEnabled && (
        <>
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <span className="text-sm font-semibold dark:text-gray-200">
                Pcnncc5G
              </span>
              <span className="text-xs text-green-500 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Connected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-gray-400" />
              <Wifi size={16} className="text-gray-400" />
              <button className="px-2 py-1 text-xs font-medium bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-600 rounded shadow-sm">
                Details...
              </button>
            </div>
          </div>

          <SettingsGroup title="Known Networks">
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700/50">
              <span className="text-[13px] font-medium dark:text-gray-200">
                Pcnncc4G
              </span>
              <div className="flex items-center gap-3 text-gray-400">
                <Lock size={14} />
                <Wifi size={16} />
                <MoreHorizontal size={16} className="cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">
                  <CheckIcon />
                </span>
                <span className="text-[13px] font-medium dark:text-gray-200">
                  Pcnncc5G
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Lock size={14} />
                <Wifi size={16} />
                <MoreHorizontal size={16} className="cursor-pointer" />
              </div>
            </div>
          </SettingsGroup>

          <SettingsGroup title="Other Networks">
            {[
              "Aarohi",
              "Anand Sadan",
              "Anand Sadan 5G",
              "BSNL -4G",
              "JioFiber4g",
              "Krishna_home",
            ].map((net, i) => (
              <div
                key={net}
                className={`flex items-center justify-between p-3 ${
                  i !== 5
                    ? "border-b border-gray-100 dark:border-gray-700/50"
                    : ""
                }`}
              >
                <span className="text-[13px] font-medium dark:text-gray-200">
                  {net}
                </span>
                <div className="flex items-center gap-3 text-gray-400">
                  {i === 0 && (
                    <button className="px-2 py-0.5 text-xs font-medium bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-600 rounded shadow-sm text-gray-900 dark:text-gray-100">
                      Connect
                    </button>
                  )}
                  <Lock size={14} />
                  <Wifi size={16} />
                  <MoreHorizontal size={16} className="cursor-pointer" />
                </div>
              </div>
            ))}
          </SettingsGroup>

          <div className="flex justify-end mb-6">
            <button className="px-2 py-1 text-xs font-medium bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-600 rounded shadow-sm dark:text-gray-200">
              Other...
            </button>
          </div>

          <SettingsGroup>
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700/50">
              <div className="flex flex-col">
                <span className="text-[13px] font-medium dark:text-gray-200">
                  Ask to join networks
                </span>
                <span className="text-[11px] text-gray-500">
                  Known networks will be joined automatically.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-gray-500">Notify</span>
                <div className="bg-gray-200 dark:bg-gray-600 rounded px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                  ↕
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex flex-col">
                <span className="text-[13px] font-medium dark:text-gray-200">
                  Ask to join hotspots
                </span>
                <span className="text-[11px] text-gray-500">
                  Allow this Mac to automatically discover nearby personal
                  hotspots.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-gray-500">Ask to Join</span>
                <div className="bg-gray-200 dark:bg-gray-600 rounded px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                  ↕
                </div>
              </div>
            </div>
          </SettingsGroup>

          <div className="flex justify-end gap-2">
            <button className="px-2 py-1 text-xs font-medium bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-600 rounded shadow-sm dark:text-gray-200">
              Advanced...
            </button>
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
              <HelpCircle size={14} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
