import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSystemStore } from "../store/systemStore";
import {
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Signal,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Monitor,
  Music,
  Play,
  SkipForward,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  toggleRef: React.RefObject<HTMLElement | null>;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  toggleRef,
}) => {
  const {
    wifiEnabled,
    toggleWifi,
    bluetoothEnabled,
    toggleBluetooth,
    airdropEnabled,
    toggleAirdrop,
    brightness,
    setBrightness,
    volume,
    setVolume,
  } = useSystemStore();
  const t = useTranslations("ControlCenter");

  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClick);
    }
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose, toggleRef]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={ref}
      className="fixed top-[30px] right-2 z-50 w-80 bg-[#e6e6e6]/90 dark:bg-[#1c1c1c]/90 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-200 origin-top-right text-black dark:text-white select-none"
    >
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Connectivity Block */}
        <div className="bg-white/50 dark:bg-[#2b2b2b]/50 rounded-xl p-3 flex flex-col justify-between gap-3 shadow-sm border border-black/5 dark:border-white/5">
          {/* Wi-Fi */}
          <div className="flex items-center gap-3 group">
            <button
              onClick={toggleWifi}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                wifiEnabled
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
              }`}
            >
              {wifiEnabled ? <Wifi size={16} /> : <WifiOff size={16} />}
            </button>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-semibold">{t("WiFi")}</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate w-20">
                {wifiEnabled ? t("HomeNetwork") : t("Off")}
              </span>
            </div>
          </div>

          {/* Bluetooth */}
          <div className="flex items-center gap-3 group">
            <button
              onClick={toggleBluetooth}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                bluetoothEnabled
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
              }`}
            >
              {bluetoothEnabled ? (
                <Bluetooth size={16} />
              ) : (
                <BluetoothOff size={16} />
              )}
            </button>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-semibold">
                {t("Bluetooth")}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {bluetoothEnabled ? t("On") : t("Off")}
              </span>
            </div>
          </div>

          {/* AirDrop */}
          <div className="flex items-center gap-3 group">
            <button
              onClick={toggleAirdrop}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                airdropEnabled
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
              }`}
            >
              <Signal
                size={16}
                className={airdropEnabled ? "" : "opacity-50"}
              />
            </button>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-semibold">{t("AirDrop")}</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {airdropEnabled ? t("ContactsOnly") : t("Off")}
              </span>
            </div>
          </div>
        </div>

        {/* Focus & DND */}
        <div className="flex flex-col gap-3">
          <div
            role="button"
            tabIndex={0}
            aria-label={t("DoNotDisturb")}
            className="flex-1 bg-white/50 dark:bg-[#2b2b2b]/50 rounded-xl p-3 flex items-center gap-3 shadow-sm border border-black/5 dark:border-white/5 cursor-pointer hover:bg-white/60 dark:hover:bg-[#2b2b2b]/70 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                // Placeholder action
              }
            }}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 dark:bg-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Moon size={16} fill="currentColor" />
            </div>
            <span className="text-[13px] font-semibold">
              {t("DoNotDisturb")}
            </span>
          </div>

          {/* Screen Mirroring (Mock) */}
          <div
            role="button"
            tabIndex={0}
            aria-label={t("ScreenMirroring")}
            className="flex-1 bg-white/50 dark:bg-[#2b2b2b]/50 rounded-xl p-3 flex items-center gap-3 shadow-sm border border-black/5 dark:border-white/5 cursor-pointer hover:bg-white/60 dark:hover:bg-[#2b2b2b]/70 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                // Placeholder action
              }
            }}
          >
            <div className="w-8 h-8 rounded-full bg-transparent border border-gray-400/50 flex items-center justify-center">
              <Monitor size={16} />
            </div>
            <span className="text-[13px] font-semibold">
              {t("ScreenMirroring")}
            </span>
          </div>
        </div>
      </div>

      {/* Display Slider */}
      <div className="bg-white/50 dark:bg-[#2b2b2b]/50 rounded-xl p-3 mb-3 shadow-sm border border-black/5 dark:border-white/5">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold ml-1">{t("Display")}</span>
          <div className="relative h-7 w-full bg-gray-200 dark:bg-black/40 rounded-full overflow-hidden group">
            <div
              className="absolute top-0 left-0 h-full bg-white dark:bg-white transition-all duration-75"
              style={{ width: `${brightness}%` }}
            />
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-default"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 mix-blend-difference">
              <Sun size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Sound Slider */}
      <div className="bg-white/50 dark:bg-[#2b2b2b]/50 rounded-xl p-3 mb-3 shadow-sm border border-black/5 dark:border-white/5">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold ml-1">{t("Sound")}</span>
          <div className="relative h-7 w-full bg-gray-200 dark:bg-black/40 rounded-full overflow-hidden group">
            <div
              className="absolute top-0 left-0 h-full bg-white dark:bg-white transition-all duration-75"
              style={{ width: `${volume}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-default"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 mix-blend-difference">
              {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </div>
          </div>
        </div>
      </div>

      {/* Media Player (Mock) */}
      <div className="bg-white/50 dark:bg-[#2b2b2b]/50 rounded-xl p-3 shadow-sm border border-black/5 dark:border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
          <Music size={20} />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-[13px] font-semibold">{t("NotPlaying")}</span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            {t("Music")}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <button className="p-1 hover:text-black dark:hover:text-white transition-colors">
            <Play size={20} fill="currentColor" />
          </button>
          <button className="p-1 hover:text-black dark:hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
