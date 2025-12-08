import React, { useMemo } from "react";
import { Globe } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useTranslations, useLocale } from "next-intl";
import { COUNTRIES } from "../../../constants/countries";

interface RegionStepProps {
  onNext: () => void;
  onBack: () => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

export const RegionStep: React.FC<RegionStepProps> = ({
  onNext,
  onBack,
  selectedCountry,
  setSelectedCountry,
}) => {
  const t = useTranslations("Setup.Region");
  const locale = useLocale();

  // Memoize region names to avoid re-calculating on every render
  const countryList = useMemo(() => {
    const regionNames = new Intl.DisplayNames([locale], { type: "region" });
    return COUNTRIES.map((code) => ({
      code,
      name: regionNames.of(code) || code,
    })).sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  return (
    <SetupWindow
      title={t("Title")}
      icon={Globe}
      onContinue={onNext}
      onBack={onBack}
    >
      <div className="w-[360px] h-[240px] bg-white dark:bg-[#1C1C1E] rounded-md border border-[#D1D1D6] dark:border-[#38383A] overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-y-auto flex-1 py-1">
          {countryList.map(({ code, name }) => (
            <div
              key={code}
              onClick={() => setSelectedCountry(code)}
              className={`
                  px-3 py-1 mx-1 rounded-[4px] text-[13px] cursor-default
                  ${
                    code === selectedCountry
                      ? "bg-[#007AFF] text-white font-medium"
                      : "text-[#86868B] dark:text-[#98989d] hover:bg-black/5 dark:hover:bg-white/10"
                  }
                `}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </SetupWindow>
  );
};
