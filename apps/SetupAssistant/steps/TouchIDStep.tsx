import React from "react";
import { Keyboard, Fingerprint } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useTranslations } from "next-intl";

interface TouchIDStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const TouchIDStep: React.FC<TouchIDStepProps> = ({ onNext, onBack }) => {
  const t = useTranslations("Setup.TouchID");

  return (
    <SetupWindow
      title={t("Title")}
      icon={Keyboard}
      onContinue={onNext}
      onBack={onBack}
      customLeftContent={
        <button
          onClick={onNext}
          className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
        >
          {t("SetupLater")}
        </button>
      }
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Keyboard Graphic */}
        <div className="relative">
          <div className="w-[400px] h-[180px] bg-linear-to-b from-[#35353A] to-[#1C1C1E] rounded-t-lg shadow-2xl border-t border-l border-r border-[#4A4A4E]">
            {/* Keyboard Keys Row 1 */}
            <div className="flex gap-1 px-2 pt-3">
              {["% 5", "^ 6", "& 7", "* 8", "( 9", ") 0", "_ -", "+ ="].map(
                (key) => (
                  <div
                    key={key}
                    className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] font-medium border border-black/40 shadow-sm"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] opacity-60">
                        {key.split(" ")[0]}
                      </span>
                      <span>{key.split(" ")[1]}</span>
                    </div>
                  </div>
                )
              )}
              <div className="w-16 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] font-medium border border-black/40 shadow-sm">
                delete
              </div>
            </div>

            {/* Keyboard Keys Row 2 */}
            <div className="flex gap-1 px-2 pt-1">
              {["T", "Y", "U", "I", "O", "P"].map((key) => (
                <div
                  key={key}
                  className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[11px] font-medium border border-black/40 shadow-sm"
                >
                  {key}
                </div>
              ))}
              <div className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] border border-black/40 shadow-sm">
                <div className="flex flex-col items-center -space-y-0.5">
                  <span className="text-[8px] opacity-60">{"{"}</span>
                  <span>{"["}</span>
                </div>
              </div>
              <div className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] border border-black/40 shadow-sm">
                <div className="flex flex-col items-center -space-y-0.5">
                  <span className="text-[8px] opacity-60">{"}"}</span>
                  <span>{"]"}</span>
                </div>
              </div>
              <div className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] border border-black/40 shadow-sm">
                <div className="flex flex-col items-center -space-y-0.5">
                  <span className="text-[8px] opacity-60">|</span>
                  <span>\</span>
                </div>
              </div>
            </div>

            {/* Keyboard Keys Row 3 */}
            <div className="flex gap-1 px-2 pt-1">
              {["G", "H", "J", "K", "L"].map((key) => (
                <div
                  key={key}
                  className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[11px] font-medium border border-black/40 shadow-sm"
                >
                  {key}
                </div>
              ))}
              <div className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] border border-black/40 shadow-sm">
                <div className="flex flex-col items-center -space-y-0.5">
                  <span className="text-[8px] opacity-60">:</span>
                  <span>;</span>
                </div>
              </div>
              <div className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] border border-black/40 shadow-sm">
                <div className="flex flex-col items-center -space-y-0.5">
                  <span className="text-[8px] opacity-60">&quot;</span>
                  <span>&apos;</span>
                </div>
              </div>
              <div className="w-20 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] font-medium border border-black/40 shadow-sm">
                return
              </div>
            </div>

            {/* Touch ID Indicator */}
            <div className="absolute -bottom-8 right-8 w-20 h-6 bg-linear-to-b from-[#2C2C2E] to-[#1C1C1E] rounded-sm flex items-center justify-center border border-[#4A4A4E] shadow-lg">
              <Fingerprint size={18} className="text-white opacity-80" />
            </div>
          </div>
          {/* Keyboard Base */}
          <div className="h-12 bg-linear-to-b from-[#D5D5D8] to-[#B8B8BC] rounded-b-lg shadow-xl border-b border-l border-r border-[#A0A0A4]" />
        </div>

        <div className="max-w-md text-center">
          <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
            {t("Description")}
          </p>
        </div>
      </div>
    </SetupWindow>
  );
};
