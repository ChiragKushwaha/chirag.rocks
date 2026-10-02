import React, { useState } from "react";
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
import { useSystemStore } from "../../../store/systemStore";

export const BluetoothView = () => {
  const t = useTranslations("SystemSettings.Bluetooth");
  const { bluetoothEnabled, toggleBluetooth } = useSystemStore();
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<string[]>([]);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleScanDevices = async () => {
    if (!bluetoothEnabled) {
      toggleBluetooth();
    }
    setIsScanning(true);
    setScanMessage(null);

    // Feature detect Web Bluetooth API
    const nav = typeof navigator !== "undefined" ? navigator : null;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    if (nav && "bluetooth" in nav && typeof (nav as any).bluetooth?.requestDevice === "function") {
      try {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const device = await (nav as any).bluetooth.requestDevice({
          acceptAllDevices: true,
        });
        if (device && device.name) {
          setFoundDevices((prev) => Array.from(new Set([...prev, device.name])));
          setScanMessage(`Paired with ${device.name}`);
        }
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name !== "NotFoundError") {
          console.warn("[WebBluetooth] Scan error:", error);
        }
      } finally {
        setIsScanning(false);
      }
    } else {
      // Fallback simulation for browsers without Web Bluetooth
      setTimeout(() => {
        setIsScanning(false);
        setFoundDevices(["AirPods Max", "Sony WH-1000XM5"]);
        setScanMessage(t("Searching"));
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#007AFF] flex items-center justify-center shrink-0 aspect-square shadow-sm">
            <Bluetooth size={28} className="text-white" />
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
        <Toggle checked={bluetoothEnabled} onChange={toggleBluetooth} />
      </div>

      <div className="text-xs text-gray-500 px-2">{t("Discoverable")}</div>

      <SettingsGroup title={t("MyDevices")}>
        <SettingsRow
          icon={Keyboard}
          label="Magic Keyboard"
          value={bluetoothEnabled ? "Connected" : t("NotConnected")}
          color="#8E8E93"
        >
          <Info size={16} className="text-gray-400" />
        </SettingsRow>
        <SettingsRow
          icon={Mouse}
          label="Magic Mouse"
          value={bluetoothEnabled ? "Connected" : t("NotConnected")}
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
        <button
          onClick={handleScanDevices}
          className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 focus:outline-none"
        >
          {isScanning && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500" />
          )}
          <span>{isScanning ? "Scanning..." : "Scan for Devices"}</span>
        </button>
      </div>

      {foundDevices.length > 0 ? (
        <SettingsGroup>
          {foundDevices.map((name, i) => (
            <SettingsRow
              key={name}
              icon={Headphones}
              label={name}
              value="Available to pair"
              color="#007AFF"
              isLast={i === foundDevices.length - 1}
            />
          ))}
        </SettingsGroup>
      ) : (
        <div
          onClick={handleScanDevices}
          className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 flex flex-col items-center justify-center gap-2 text-gray-400 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252528] transition-colors"
        >
          <Bluetooth size={24} className="opacity-50" />
          <span>{scanMessage || t("Searching")}</span>
        </div>
      )}
    </div>
  );
};
