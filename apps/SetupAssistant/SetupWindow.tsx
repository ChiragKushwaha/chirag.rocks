import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useSetupContext } from "./SetupContext";

interface SetupWindowProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onBack?: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  description?: string;
  customLeftContent?: React.ReactNode;
}

export const SetupWindow: React.FC<SetupWindowProps> = ({
  title,
  icon: Icon,
  children,
  onBack,
  onContinue,
  continueDisabled = false,
  description,
  customLeftContent,
}) => {
  const { currentStep } = useSetupContext();

  // Map steps to dots
  const getActiveDot = (step: string) => {
    switch (step) {
      case "hello":
      case "language":
        return "language";
      case "region":
      case "dataprivacy":
        return "region";
      case "touchid":
      case "fingerprint":
      case "languages":
      case "accessibility":
      case "migration":
      case "appleid":
      case "account":
        return "account";
      case "theme":
        return "theme";
      default:
        return "";
    }
  };

  const activeDot = getActiveDot(currentStep);

  return (
    <div className="fixed inset-0 bg-[#2b2b2b] flex items-center justify-center z-9999 font-sans selection:bg-[#007AFF] selection:text-white">
      <Image
        src="/hello-gradient-bg.webp"
        alt="Background"
        fill
        priority
        className="object-cover -z-10"
      />
      {/* Background Overlay for readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Main Window - Dimensions matched to macOS Setup Assistant */}
      <div className="w-[780px] h-[560px] bg-[#F2F2F7]/95 dark:bg-[#1E1E1E]/95 backdrop-blur-2xl rounded-[12px] shadow-2xl border border-white/20 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Title Bar (Empty/Draggable) */}
        <div className="h-8 w-full shrink-0 drag-region" />

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center pt-8 px-12 overflow-y-auto">
          {/* Feature Icon Style - Matching 'Template - Icon - Feature' */}
          <div className="mb-6 relative">
            <div className="w-[72px] h-[72px] bg-linear-to-b from-[#007AFF] to-[#0055B3] rounded-full flex items-center justify-center shadow-lg border border-white/10">
              <Icon
                size={36}
                className="text-white drop-shadow-md"
                strokeWidth={2}
              />
            </div>
          </div>

          <h1 className="text-[26px] font-bold text-center text-black dark:text-white mb-3 tracking-tight leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center mb-8 max-w-md leading-relaxed">
              {description}
            </p>
          )}

          <div className="w-full flex-1 flex flex-col items-center">
            {children}
          </div>
        </div>

        {/* Footer Actions - Matching macOS Button Styles */}
        <div className="h-[60px] flex items-center justify-between px-8 pb-4">
          <div className="w-auto min-w-[96px] flex items-center gap-10">
            {customLeftContent}
            {onBack && (
              <button
                onClick={onBack}
                className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
              >
                Back
              </button>
            )}
          </div>

          {/* Pagination Indicators */}
          <div className="flex gap-2 absolute left-1/2 -translate-x-1/2 bottom-8">
            {["language", "region", "account", "theme"].map((s) => (
              <div
                key={s}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  s === activeDot
                    ? "bg-[#8E8E93] dark:bg-[#98989D]"
                    : "bg-[#D1D1D6] dark:bg-[#3A3A3C]"
                }`}
              />
            ))}
          </div>

          <div className="w-auto min-w-[96px] flex justify-end">
            <button
              onClick={onContinue}
              disabled={continueDisabled}
              className={`
              flex items-center justify-center gap-1.5 bg-[#007AFF] text-white px-4 py-[5px] rounded-[6px] 
              text-[13px] font-medium shadow-sm hover:bg-[#0071E3] active:bg-[#005BB5] transition-all
              disabled:opacity-30 disabled:cursor-default
            `}
            >
              Continue
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
