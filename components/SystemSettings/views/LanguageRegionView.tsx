import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  HelpCircle,
  ChevronsUpDown,
} from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

interface LanguageRegionViewProps {
  onBack: () => void;
}

import { LanguageSelectorModal } from "../modals/LanguageSelectorModal";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

interface LanguageRegionViewProps {
  onBack: () => void;
}

export const LanguageRegionView: React.FC<LanguageRegionViewProps> = ({
  onBack,
}) => {
  const [liveText, setLiveText] = useState(true);
  const [temperature, setTemperature] = useState<"c" | "f">("c");
  const [measurement, setMeasurement] = useState<"metric" | "us" | "uk">(
    "metric"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    // Explicitly set the cookie for immediate client-side persistence
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.replace(pathname, { locale: newLocale });
    setIsModalOpen(false);
  };

  const getLanguageName = (code: string) => {
    switch (code) {
      case "en":
        return "English";
      case "es":
        return "Spanish";
      case "hi":
        return "Hindi";
      default:
        return code;
    }
  };

  const getLanguageNativeName = (code: string) => {
    switch (code) {
      case "en":
        return "English (India) — Primary"; // Hardcoded for demo matching screenshot
      case "es":
        return "Español — Primario";
      case "hi":
        return "हिन्दी — प्राथमिक";
      default:
        return `${code} — Primary`;
    }
  };

  return (
    <div className="pt-4 px-4 max-w-2xl mx-auto pb-12">
      <LanguageSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleLanguageChange}
      />

      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        <button
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-30"
          disabled
        >
          <ChevronRight
            size={20}
            className="text-gray-400 dark:text-gray-600"
          />
        </button>
        <h1 className="text-xl font-bold dark:text-white ml-2">
          Language & Region
        </h1>
      </div>

      {/* Preferred Languages */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">
          Preferred Languages
        </h3>
        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden flex flex-col h-32">
          {/* List Header/Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white text-sm">
              <span>{getLanguageName(currentLocale)}</span>
              <span className="opacity-80">
                {getLanguageNativeName(currentLocale)}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex border-t border-gray-200 dark:border-gray-700/50 divide-x divide-gray-200 dark:divide-gray-700/50">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-1.5 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <Plus size={16} className="text-gray-500" />
            </button>
            <button className="flex-1 py-1.5 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <Minus size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Sample Date/Time Preview */}
      <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-white/5 flex flex-col items-center justify-center text-center gap-1">
        <div className="text-sm font-medium dark:text-gray-200">
          Sunday, 7 December 2025 at 4:27:47 PM IST
        </div>
        <div className="text-sm text-gray-500 font-mono">
          07/12/25, 4:27 PM ₹12,345.67 4,567.89
        </div>
      </div>

      {/* Region & Formats */}
      <SettingsGroup>
        <SettingsRow label="Region" isLast={false}>
          <div className="flex items-center gap-2 text-blue-500 text-sm">
            <span>India</span>
            <ChevronsUpDown size={14} />
          </div>
        </SettingsRow>
        <SettingsRow label="Calendar" isLast={false}>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Gregorian</span>
            <ChevronsUpDown size={14} />
          </div>
        </SettingsRow>

        {/* Custom Mock Rows for Radio Buttons */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700/50 min-h-[48px]">
          <span className="text-[13px] font-medium dark:text-gray-200">
            Temperature
          </span>
          <div className="flex items-center gap-4 text-[13px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={temperature === "c"}
                onChange={() => setTemperature("c")}
                className="accent-blue-500"
              />
              <span className="dark:text-gray-200">Celsius (°C)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={temperature === "f"}
                onChange={() => setTemperature("f")}
                className="accent-blue-500"
              />
              <span className="dark:text-gray-200">Fahrenheit (°F)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700/50 min-h-[48px]">
          <span className="text-[13px] font-medium dark:text-gray-200">
            Measurement system
          </span>
          <div className="flex items-center gap-4 text-[13px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={measurement === "metric"}
                onChange={() => setMeasurement("metric")}
                className="accent-blue-500"
              />
              <span className="dark:text-gray-200">Metric</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={measurement === "us"}
                onChange={() => setMeasurement("us")}
                className="accent-blue-500"
              />
              <span className="dark:text-gray-200">US</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={measurement === "uk"}
                onChange={() => setMeasurement("uk")}
                className="accent-blue-500"
              />
              <span className="dark:text-gray-200">UK</span>
            </label>
          </div>
        </div>

        <SettingsRow label="First day of week" isLast={false}>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Sunday</span>
            <ChevronsUpDown size={14} />
          </div>
        </SettingsRow>
        <SettingsRow label="Date format" isLast={false}>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>19/08/25</span>
            <ChevronsUpDown size={14} />
          </div>
        </SettingsRow>
        <SettingsRow label="Number format" isLast={true}>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>12,34,567.89</span>
            <ChevronsUpDown size={14} />
          </div>
        </SettingsRow>
      </SettingsGroup>

      {/* Live Text */}
      <SettingsGroup>
        <SettingsRow
          label="Live Text"
          type="toggle"
          value={liveText}
          onClick={() => setLiveText(!liveText)}
          isLast
        >
          <div className="block text-xs text-gray-400 mt-0.5 font-normal">
            Select text in images to copy or take action.
          </div>
        </SettingsRow>
      </SettingsGroup>

      {/* Applications */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">
          Applications
        </h3>
        <p className="text-xs text-gray-400 mb-2 px-2">
          Customise language settings for the following applications:
        </p>
        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden flex flex-col h-24">
          <div className="flex-1">{/* Empty state or list */}</div>
          <div className="flex border-t border-gray-200 dark:border-gray-700/50 divide-x divide-gray-200 dark:divide-gray-700/50">
            <button className="flex-1 py-1.5 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <Plus size={16} className="text-gray-500" />
            </button>
            <button className="flex-1 py-1.5 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <Minus size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <button className="px-3 py-1 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700/50 rounded-md text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          Translation Languages...
        </button>
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 cursor-help">
          <HelpCircle size={14} />
        </div>
      </div>
    </div>
  );
};
