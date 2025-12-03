import React, { useState } from "react";
import { Download } from "lucide-react";
import { SetupWindow } from "../SetupWindow";

interface MigrationStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const MigrationStep: React.FC<MigrationStepProps> = ({
  onNext,
  onBack,
}) => {
  const [migrationChoice, setMigrationChoice] = useState("mac");

  return (
    <SetupWindow
      title="Migration Assistant"
      icon={Download}
      onContinue={onNext}
      onBack={onBack}
      customLeftContent={
        <button
          onClick={onNext}
          className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
        >
          Not Now
        </button>
      }
    >
      <div className="max-w-lg space-y-8">
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center leading-relaxed">
          If you have information on another Mac or a Windows PC, you can
          transfer it to this Mac. You can also transfer information from a Time
          Machine backup or another startup disk.
        </p>

        <div className="space-y-4">
          <p className="text-[13px] font-medium text-black dark:text-white text-center">
            How do you want to transfer your information?
          </p>

          {/* Radio Options */}
          <div className="space-y-3">
            <div
              onClick={() => setMigrationChoice("mac")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  migrationChoice === "mac"
                    ? "border-[#007AFF]"
                    : "border-[#D1D1D6] dark:border-[#38383A]"
                }`}
              >
                {migrationChoice === "mac" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF]" />
                )}
              </div>
              <span className="text-[13px] text-black dark:text-white">
                From a Mac, Time Machine backup or Startup disk
              </span>
            </div>

            <div
              onClick={() => setMigrationChoice("windows")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  migrationChoice === "windows"
                    ? "border-[#007AFF]"
                    : "border-[#D1D1D6] dark:border-[#38383A]"
                }`}
              >
                {migrationChoice === "windows" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF]" />
                )}
              </div>
              <span className="text-[13px] text-black dark:text-white">
                From a Windows PC
              </span>
            </div>
          </div>
        </div>
      </div>
    </SetupWindow>
  );
};
