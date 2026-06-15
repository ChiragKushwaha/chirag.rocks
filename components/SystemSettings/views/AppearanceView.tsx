"use client";
import React from "react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useSystemStore } from "../../../store/systemStore";
import { useTranslations } from "next-intl";

const ACCENT_COLORS = [
  { color: "#FF3B30", label: "Red" },
  { color: "#FF9500", label: "Orange" },
  { color: "#FFCC00", label: "Yellow" },
  { color: "#34C759", label: "Green" },
  { color: "#007AFF", label: "Blue" },
  { color: "#5856D6", label: "Purple" },
  { color: "#FF2D55", label: "Pink" },
  { color: "#8E8E93", label: "Graphite" },
];

export const AppearanceView = () => {
  const { theme, setTheme } = useSystemStore();
  const t = useTranslations("SystemSettings.Appearance");

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h2 className="text-[22px] font-semibold text-gray-900 mb-1">
          {t("Title")}
        </h2>
        <p className="text-[13px] text-gray-500">{t("Description")}</p>
      </div>

      {/* Appearance thumbnails */}
      <SettingsGroup>
        <div className="p-4">
          <div className="flex gap-4">
            {(
              [
                { id: "light", label: t("Light") },
                { id: "dark", label: t("Dark") },
                { id: "auto", label: t("Auto") },
              ] as const
            ).map(({ id, label }) => {
              const isSelected = theme === id;
              return (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className="flex flex-col items-center gap-2 focus:outline-none"
                >
                  {/* Thumbnail */}
                  <div
                    className="relative w-[88px] h-[56px] rounded-lg overflow-hidden border-2 transition-all"
                    style={{
                      borderColor: isSelected ? "#007AFF" : "transparent",
                      boxShadow: isSelected
                        ? "0 0 0 3px rgba(0,122,255,0.25)"
                        : "0 1px 4px rgba(0,0,0,0.15)",
                    }}
                  >
                    {id === "light" && (
                      <>
                        <div className="absolute inset-0 bg-[#f5f5f5]" />
                        <div className="absolute top-0 left-0 right-0 h-3 bg-[#e5e5e5]" />
                        <div className="absolute bottom-2 left-2 right-2 h-2 rounded bg-blue-200" />
                      </>
                    )}
                    {id === "dark" && (
                      <>
                        <div className="absolute inset-0 bg-[#2b2b2b]" />
                        <div className="absolute top-0 left-0 right-0 h-3 bg-[#3a3a3a]" />
                        <div className="absolute bottom-2 left-2 right-2 h-2 rounded bg-blue-800" />
                      </>
                    )}
                    {id === "auto" && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f5f5] to-[#2b2b2b]" />
                        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#e5e5e5] to-[#3a3a3a]" />
                        <div className="absolute bottom-2 left-2 right-2 h-2 rounded bg-gradient-to-r from-blue-200 to-blue-800" />
                      </>
                    )}
                    {isSelected && (
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span
                    className="text-[12px] font-medium"
                    style={{ color: isSelected ? "#007AFF" : "#3c3c43" }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </SettingsGroup>

      {/* Accent Color */}
      <SettingsGroup>
        <div className="px-4 py-3 flex items-center justify-between border-b border-black/[0.06]">
          <span className="text-[13px] text-gray-900">{t("AccentColor")}</span>
          <div className="flex gap-2">
            {ACCENT_COLORS.map(({ color, label }) => (
              <button
                key={color}
                title={label}
                className="w-5 h-5 rounded-full ring-1 ring-black/10 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                style={{ background: color }}
              />
            ))}
          </div>
        </div>
        <SettingsRow label={t("HighlightColor")} value={t("Automatic")} />
        <SettingsRow label={t("SidebarIconSize")} value={t("Medium")} />
        <SettingsRow
          label={t("WallpaperTinting")}
          type="toggle"
          value={true}
          isLast
        />
      </SettingsGroup>

      {/* Show Scroll Bars */}
      <SettingsGroup title={t("ShowScrollBars")}>
        <div className="px-4 py-3 space-y-2.5">
          {[
            { id: "scroll-auto", label: t("ScrollAuto"), defaultChecked: true },
            { id: "scroll-scrolling", label: t("ScrollWhenScrolling") },
            { id: "scroll-always", label: t("ScrollAlways") },
          ].map(({ id, label, defaultChecked }) => (
            <div key={id} className="flex items-center gap-2">
              <input
                type="radio"
                name="scroll"
                id={id}
                defaultChecked={defaultChecked}
                className="accent-blue-500 w-3.5 h-3.5"
              />
              <label htmlFor={id} className="text-[13px] text-gray-900 cursor-pointer">
                {label}
              </label>
            </div>
          ))}
        </div>
      </SettingsGroup>

      {/* Click in the Scroll Bar */}
      <SettingsGroup title={t("ClickScrollBar")}>
        <div className="px-4 py-3 space-y-2.5">
          {[
            { id: "click-next", label: t("JumpNextPage"), defaultChecked: true },
            { id: "click-spot", label: t("JumpSpotClicked") },
          ].map(({ id, label, defaultChecked }) => (
            <div key={id} className="flex items-center gap-2">
              <input
                type="radio"
                name="click"
                id={id}
                defaultChecked={defaultChecked}
                className="accent-blue-500 w-3.5 h-3.5"
              />
              <label htmlFor={id} className="text-[13px] text-gray-900 cursor-pointer">
                {label}
              </label>
            </div>
          ))}
        </div>
      </SettingsGroup>
    </div>
  );
};
