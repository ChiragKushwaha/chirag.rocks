import React from "react";
import { Users, Eye, Hand, Ear, Brain } from "lucide-react";
import { SetupWindow } from "../SetupWindow";

interface AccessibilityStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const AccessibilityStep: React.FC<AccessibilityStepProps> = ({
  onNext,
  onBack,
}) => {
  return (
    <SetupWindow
      title="Accessibility"
      icon={Users}
      onContinue={onNext}
      onBack={onBack}
      customLeftContent={
        <button
          onClick={onNext}
          className="text-[#6e6e73] dark:text-[#98989d] text-[13px] font-medium hover:text-black dark:hover:text-white transition-colors"
        >
          Not Now
        </button>
      }
    >
      <div className="max-w-2xl space-y-6">
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center leading-relaxed">
          Accessibility features adapt your Mac to your individual needs. You
          can turn them on now to help you finish setting up, and further
          customise them later in System Preferences. See what&apos;s available
          in each of the categories below.
        </p>

        {/* Four Categories */}
        <div className="grid grid-cols-4 gap-4">
          {/* Vision */}
          <div className="flex flex-col items-center gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-[#E5E5EA] dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
              <Eye size={32} className="text-[#6e6e73] dark:text-[#98989d]" />
            </div>
            <span className="text-[13px] font-medium text-black dark:text-white">
              Vision
            </span>
          </div>

          {/* Motor */}
          <div className="flex flex-col items-center gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-[#E5E5EA] dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
              <Hand size={32} className="text-[#6e6e73] dark:text-[#98989d]" />
            </div>
            <span className="text-[13px] font-medium text-black dark:text-white">
              Motor
            </span>
          </div>

          {/* Hearing */}
          <div className="flex flex-col items-center gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-[#E5E5EA] dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
              <Ear size={32} className="text-[#6e6e73] dark:text-[#98989d]" />
            </div>
            <span className="text-[13px] font-medium text-black dark:text-white">
              Hearing
            </span>
          </div>

          {/* Cognitive */}
          <div className="flex flex-col items-center gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-[#E5E5EA] dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
              <Brain size={32} className="text-[#6e6e73] dark:text-[#98989d]" />
            </div>
            <span className="text-[13px] font-medium text-black dark:text-white">
              Cognitive
            </span>
          </div>
        </div>
      </div>
    </SetupWindow>
  );
};
