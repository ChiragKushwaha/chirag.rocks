import React from "react";
import { HardDrive, Laptop, Cloud, Database } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useTranslations } from "next-intl";

interface MigrationStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const MigrationStep: React.FC<MigrationStepProps> = ({
  onNext,
  onBack,
}) => {
  const t = useTranslations("Setup.Migration");
  const tCommon = useTranslations("Setup.Common");

  return (
    <SetupWindow
      title={t("Title")}
      icon={HardDrive}
      onContinue={onNext}
      onBack={onBack}
      customLeftContent={
        <button
          onClick={onNext}
          className="text-[#6e6e73] dark:text-[#98989d] text-[13px] font-medium hover:text-black dark:hover:text-white transition-colors"
        >
          {tCommon("NotNow")}
        </button>
      }
    >
      <div className="max-w-xl space-y-6">
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center leading-relaxed">
          {t("Description")}
        </p>

        {/* Migration Options */}
        <div className="space-y-3">
          {/* From Mac/PC */}
          <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-transparent hover:border-[#007AFF] transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-linear-to-b from-[#8E8E93] to-[#636366] rounded-full flex items-center justify-center shrink-0">
              <Laptop size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-black dark:text-white mb-0.5">
                {t("FromMacPC")}
              </h3>
              <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
                {t("FromMacPCDesc")}
              </p>
            </div>
          </div>

          {/* From Time Machine */}
          <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-transparent hover:border-[#007AFF] transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-[#34C759] rounded-full flex items-center justify-center shrink-0">
              <Database size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-black dark:text-white mb-0.5">
                {t("FromTimeMachine")}
              </h3>
              <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
                {t("FromTimeMachineDesc")}
              </p>
            </div>
          </div>

          {/* From Windows */}
          <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-transparent hover:border-[#007AFF] transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center shrink-0">
              <Cloud size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-black dark:text-white mb-0.5">
                {t("FromWindows")}
              </h3>
              <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
                {t("FromWindowsDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SetupWindow>
  );
};
