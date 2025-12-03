import React from "react";
import { Globe, Keyboard } from "lucide-react";
import { SetupWindow } from "../SetupWindow";

interface LanguagesStepProps {
  onNext: () => void;
  onBack: () => void;
  selectedLanguages: string[];
}

export const LanguagesStep: React.FC<LanguagesStepProps> = ({
  onNext,
  onBack,
  selectedLanguages,
}) => {
  return (
    <SetupWindow
      title="Written and Spoken Languages"
      icon={Globe}
      onContinue={onNext}
      onBack={onBack}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center leading-relaxed mb-8">
          The following languages are commonly used in your region. You can set
          up your Mac to use these settings or customise them individually.
        </p>

        {/* Preferred Languages */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-linear-to-b from-[#007AFF] to-[#0055B3] rounded-full flex items-center justify-center shrink-0 shadow-md">
            <Globe size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[13px] font-semibold text-black dark:text-white mb-1">
              Preferred Languages
            </h3>
            <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
              {selectedLanguages.join(", ")}
            </p>
          </div>
        </div>

        {/* Input Sources */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-linear-to-b from-[#007AFF] to-[#0055B3] rounded-full flex items-center justify-center shrink-0 shadow-md">
            <Keyboard size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[13px] font-semibold text-black dark:text-white mb-1">
              Input Sources
            </h3>
            <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
              ABC – QWERTZ
            </p>
            <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
              German
            </p>
          </div>
        </div>

        {/* Dictation */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-linear-to-b from-[#007AFF] to-[#0055B3] rounded-full flex items-center justify-center shrink-0 shadow-md">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-[13px] font-semibold text-black dark:text-white mb-1">
              Dictation
            </h3>
            <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
              English (United Kingdom)
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors">
            Customise Settings
          </button>
        </div>
      </div>
    </SetupWindow>
  );
};
