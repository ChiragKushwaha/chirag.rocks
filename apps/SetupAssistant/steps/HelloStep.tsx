import React from "react";
import HelloStrokeMultiLang from "../../../components/HelloStrokeMultiLang";
import { useTranslations } from "next-intl";

interface HelloStepProps {
  onNext: () => void;
}

export const HelloStep: React.FC<HelloStepProps> = ({ onNext }) => {
  const t = useTranslations("Hello");

  return (
    <div className="fixed inset-0 z-9999">
      <HelloStrokeMultiLang />
      {/* Auto-advance to language selection after animation completes */}
      <button
        onClick={onNext}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <div className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110">
          <svg
            className="w-4 h-4 text-white/90 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        <span className="text-white/80 text-xs font-medium tracking-wide">
          {t("GetStarted")}
        </span>
      </button>
    </div>
  );
};
