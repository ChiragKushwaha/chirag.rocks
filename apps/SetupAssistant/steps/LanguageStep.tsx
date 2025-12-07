import React from "react";
import { Globe } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useSystemStore } from "../../../store/systemStore";

import { useRouter, usePathname } from "@/i18n/routing";

interface LanguageStepProps {
  onNext: () => void;
  onBack: () => void;
}

const LANGUAGE_MAP: Record<string, string> = {
  English: "en",
  Español: "es",
  Français: "fr",
  Deutsch: "de",
  Italiano: "it",
  日本語: "ja",
  中文: "zh",
  Português: "pt",
  Русский: "ru",
  한국어: "ko",
  Nederlands: "nl",
  Svenska: "sv",
  Dansk: "da",
  Norsk: "no",
  Suomi: "fi",
  Polski: "pl",
  Türkçe: "tr",
  العربية: "ar",
  हिन्दी: "hi",
  বাংলা: "bn",
  "Tiếng Việt": "vi",
  ภาษาไทย: "th",
  Ελληνικά: "el",
  Čeština: "cs",
  Magyar: "hu",
  Română: "ro",
  Українська: "uk",
  "Bahasa Indonesia": "id",
  "Bahasa Melayu": "ms",
  Hrvatski: "hr",
  Slovenčina: "sk",
  Slovenščina: "sl",
  Български: "bg",
  Srpski: "sr",
  עברית: "he",
};

export const LanguageStep: React.FC<LanguageStepProps> = ({
  onNext,
  onBack,
}) => {
  const { language, setLanguage } = useSystemStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);

    const localeCode = LANGUAGE_MAP[lang];
    if (localeCode) {
      // Explicitly set the cookie for immediate persistence
      document.cookie = `NEXT_LOCALE=${localeCode}; path=/; max-age=31536000; SameSite=Lax`;
      // Switch locale using next-intl router
      router.replace(pathname, { locale: localeCode });
    }
  };

  return (
    <SetupWindow
      title="Select Your Language"
      description="Select the language you would like to use for your Mac."
      icon={Globe}
      onContinue={onNext}
      onBack={onBack}
    >
      <div className="w-[360px] h-[240px] bg-white dark:bg-[#1C1C1E] rounded-md border border-[#D1D1D6] dark:border-[#38383A] overflow-hidden shadow-sm flex flex-col">
        {/* NSTableView Header */}
        <div className="h-6 bg-[#F5F5F5] dark:bg-[#2C2C2E] border-b border-[#D1D1D6] dark:border-[#38383A] flex items-center px-3">
          <span className="text-[11px] font-semibold text-[#6e6e73] dark:text-[#98989d]">
            Language
          </span>
        </div>

        {/* NSTableView Rows */}
        <div className="overflow-y-auto flex-1 py-1">
          {Object.keys(LANGUAGE_MAP).map((lang) => (
            <div
              key={lang}
              onClick={() => handleLanguageSelect(lang)}
              className={`
                  px-3 py-1 mx-1 rounded-[4px] text-[13px] cursor-default flex items-center justify-between
                  ${
                    language === lang
                      ? "bg-[#007AFF] text-white font-medium"
                      : "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 even:bg-black/2 dark:even:bg-white/2"
                  }
                `}
            >
              <span>{lang}</span>
              {language === lang && (
                <span className="text-[11px] opacity-90 font-normal">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SetupWindow>
  );
};
