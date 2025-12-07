import React from "react";
import { Globe } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useSystemStore } from "../../../store/systemStore";
import { useTranslations } from "next-intl";

import { useRouter, usePathname } from "@/i18n/routing";

interface LanguageStepProps {
  onNext: () => void;
  onBack: () => void;
}

import { LANGUAGE_MAP } from "@/constants/languages";

export const LanguageStep: React.FC<LanguageStepProps> = ({
  onNext,
  onBack,
}) => {
  const { language, setLanguage } = useSystemStore();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Setup.Language");

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);

    const localeCode = LANGUAGE_MAP[lang];
    if (localeCode) {
      // Explicitly set the cookie for immediate persistence
      // eslint-disable-next-line
      document.cookie = `NEXT_LOCALE=${localeCode}; path=/; max-age=31536000; SameSite=Lax`;
      // Switch locale using next-intl router
      router.replace(pathname, { locale: localeCode });
    }
  };

  return (
    <SetupWindow
      title={t("Title")}
      description={t("Description")}
      icon={Globe}
      onContinue={onNext}
      onBack={onBack}
    >
      <div className="w-[360px] h-[240px] bg-white dark:bg-[#1C1C1E] rounded-md border border-[#D1D1D6] dark:border-[#38383A] overflow-hidden shadow-sm flex flex-col">
        {/* NSTableView Header */}
        <div className="h-6 bg-[#F5F5F5] dark:bg-[#2C2C2E] border-b border-[#D1D1D6] dark:border-[#38383A] flex items-center px-3">
          <span className="text-[11px] font-semibold text-[#6e6e73] dark:text-[#98989d]">
            {t("LanguageColumn")}
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
                  {t("Primary")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SetupWindow>
  );
};
