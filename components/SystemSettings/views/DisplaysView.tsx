import React, { useState, useEffect } from "react";
import { Monitor, Maximize2, Minimize2, Cast, Sun } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";
import { useSystemStore } from "../../../store/systemStore";

export const DisplaysView = () => {
  const t = useTranslations("SystemSettings.Displays");
  const { brightness, setBrightness, isScreenMirroring, setScreenMirroring } =
    useSystemStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resolutionInfo, setResolutionInfo] = useState({
    width: 1512,
    height: 982,
    scale: 2,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setResolutionInfo({
        width: window.screen.width,
        height: window.screen.height,
        scale: window.devicePixelRatio || 1,
      });

      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
      };
    }
  }, []);

  const toggleFullscreen = async () => {
    if (typeof document === "undefined") return;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  };

  const handleCastToggle = async () => {
    if (isScreenMirroring) {
      setScreenMirroring(false);
      return;
    }

    try {
      if (typeof window !== "undefined" && "PresentationRequest" in window) {
        try {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          const pr = new (window as any).PresentationRequest(["https://chirag.rocks"]);
          await pr.start();
          setScreenMirroring(true);
          return;
        } catch (e: unknown) {
          const err = e as Error;
          if (err.name === "NotAllowedError") return;
        }
      }

      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        setScreenMirroring(true);
        stream.getVideoTracks()[0]?.addEventListener("ended", () => {
          setScreenMirroring(false);
        });
      } else {
        setScreenMirroring(true);
      }
    } catch (err) {
      console.warn("[DisplaysView] Cast error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full shrink-0 aspect-square shadow-sm bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Monitor size={32} className="text-gray-500" />
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

      <div className="flex justify-center py-4">
        <div className="relative w-56 h-36 bg-gray-800 rounded-t-xl border-4 border-gray-300 dark:border-gray-600 border-b-0 flex items-center justify-center shadow-lg">
          <div className="w-full h-full bg-linear-to-b from-blue-400 to-blue-600 opacity-80 rounded-t-lg"></div>
          <div className="absolute flex flex-col items-center gap-1 text-center">
            <span className="text-white text-xs font-semibold drop-shadow-md">
              {t("BuiltInDisplay")}
            </span>
            <span className="text-white/80 text-[10px]">
              {resolutionInfo.width * resolutionInfo.scale} ×{" "}
              {resolutionInfo.height * resolutionInfo.scale} Retina
            </span>
          </div>
        </div>
      </div>

      <SettingsGroup title={t("BuiltInDisplay")}>
        <SettingsRow label={t("UseAs")} value={t("MainDisplay")} />
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex justify-between mb-2">
            <span className="text-[13px] font-medium dark:text-gray-200">
              {t("Resolution")}
            </span>
            <span className="text-[13px] text-gray-500">{t("Default")}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <div className="shrink-0 w-24 h-16 border rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-xs dark:text-gray-300">
              {t("MoreSpace")}
            </div>
            <div className="shrink-0 w-24 h-16 border-2 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
              {t("Default")}
            </div>
            <div className="shrink-0 w-24 h-16 border rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-xs dark:text-gray-300">
              {t("LargerText")}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-[13px] font-medium dark:text-gray-200 flex items-center gap-2">
            <Sun size={14} className="text-yellow-500" />
            {t("Brightness")}
          </span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={20}
              max={100}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              aria-label="Display Brightness"
              className="w-32 accent-blue-500 cursor-pointer"
            />
            <span className="text-xs text-gray-500 w-8 text-right font-mono">
              {brightness}%
            </span>
          </div>
        </div>
        <div
          onClick={toggleFullscreen}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <SettingsRow
            icon={isFullscreen ? Minimize2 : Maximize2}
            label={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
            value={isFullscreen ? "Active" : "Windowed"}
            color="#007AFF"
          />
        </div>
        <div
          onClick={handleCastToggle}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <SettingsRow
            icon={Cast}
            label="AirPlay & Cast Display"
            value={isScreenMirroring ? "Connected" : "Off"}
            color={isScreenMirroring ? "#34C759" : "#8E8E93"}
            isLast
          />
        </div>
      </SettingsGroup>
    </div>
  );
};
