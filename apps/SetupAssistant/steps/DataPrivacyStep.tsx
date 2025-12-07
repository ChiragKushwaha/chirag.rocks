import React from "react";
import { Users } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useTranslations } from "next-intl";

interface DataPrivacyStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const DataPrivacyStep: React.FC<DataPrivacyStepProps> = ({
  onNext,
  onBack,
}) => {
  const t = useTranslations("Setup.DataPrivacy");
  const tCommon = useTranslations("Setup.Common");

  return (
    <SetupWindow
      title={t("Title")}
      icon={Users}
      onContinue={onNext}
      onBack={onBack}
    >
      <div className="max-w-md space-y-4 text-center">
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
          {t("IconText")}
        </p>
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
          {t("FeatureText")}
        </p>
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
          {t("PrivacyText")}
        </p>
        <button className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors mt-2">
          {tCommon("LearnMore")}
        </button>
      </div>
    </SetupWindow>
  );
};
