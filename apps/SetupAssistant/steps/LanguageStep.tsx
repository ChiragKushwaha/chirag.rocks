import React from "react";
import { Globe } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useSystemStore } from "../../../store/systemStore";

interface LanguageStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const LanguageStep: React.FC<LanguageStepProps> = ({
  onNext,
  onBack,
}) => {
  const { language, setLanguage } = useSystemStore();

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
          {[
            "English",
            "Español",
            "Français",
            "Deutsch",
            "Italiano",
            "日本語",
            "中文",
            "Português",
            "Русский",
            "한국어",
            "Nederlands",
            "Svenska",
            "Dansk",
            "Norsk",
            "Suomi",
            "Polski",
            "Türkçe",
            "العربية",
            "हिन्दी",
            "বাংলা",
            "Tiếng Việt",
            "ภาษาไทย",
            "Ελληνικά",
            "Čeština",
            "Magyar",
            "Română",
            "Українська",
            "Bahasa Indonesia",
            "Bahasa Melayu",
            "Hrvatski",
            "Slovenčina",
            "Slovenščina",
            "Български",
            "Srpski",
            "עברית",
          ].map((lang) => (
            <div
              key={lang}
              onClick={() => setLanguage(lang)}
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
