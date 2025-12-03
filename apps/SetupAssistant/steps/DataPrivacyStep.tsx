import React from "react";
import { Users } from "lucide-react";
import { SetupWindow } from "../SetupWindow";

interface DataPrivacyStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const DataPrivacyStep: React.FC<DataPrivacyStepProps> = ({
  onNext,
  onBack,
}) => {
  return (
    <SetupWindow
      title="Data & Privacy"
      icon={Users}
      onContinue={onNext}
      onBack={onBack}
    >
      <div className="max-w-md space-y-4 text-center">
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
          This icon appears when an Apple feature asks to use your personal
          information.
        </p>
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
          You won't see this with every feature since Apple collects this
          information only when needed to enable features, secure our services
          or personalise your experience.
        </p>
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
          Apple believes privacy is a fundamental human right, so every Apple
          product is designed to minimise the collection and use of your data,
          use on-device processing whenever possible, and provide transparency
          and control over your information.
        </p>
        <button className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors mt-2">
          Learn More
        </button>
      </div>
    </SetupWindow>
  );
};
