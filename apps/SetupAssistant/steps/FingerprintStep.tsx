import React, { useState } from "react";
import { Fingerprint } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useSystemStore } from "../../../store/systemStore";
import { useTranslations } from "next-intl";

interface FingerprintStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const FingerprintStep: React.FC<FingerprintStepProps> = ({
  onNext,
  onBack,
}) => {
  const { theme } = useSystemStore();
  const t = useTranslations("Setup.Fingerprint");
  const tTouchID = useTranslations("Setup.TouchID");
  const tCommon = useTranslations("Setup.Common");

  const [fingerprintProgress, setFingerprintProgress] = useState(0);
  const [fingerprintComplete, setFingerprintComplete] = useState(false);

  const reset = () => {
    setFingerprintProgress(0);
    setFingerprintComplete(false);
  };

  return (
    <SetupWindow
      title={t("Title")}
      icon={Fingerprint}
      onContinue={onNext}
      onBack={() => {
        reset();
        onBack();
      }}
    >
      <div className="flex flex-col items-center space-y-6">
        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center max-w-sm">
          {t("Instruction")}
        </p>

        {/* Animated Fingerprint Graphic */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Fingerprint SVG with Animation */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            style={{ transform: "scale(1.2)" }}
          >
            {/* Fingerprint lines with progressive reveal */}
            {[...Array(12)].map((_, i) => {
              const radius = 20 + i * 8;
              const opacity =
                fingerprintProgress > i * 8 ? 0.8 - i * 0.05 : 0.1;
              return (
                <ellipse
                  key={i}
                  cx="100"
                  cy="100"
                  rx={radius}
                  ry={radius + 5}
                  fill="none"
                  stroke={
                    fingerprintComplete
                      ? "#34C759"
                      : theme === "dark"
                      ? "#E5989B"
                      : "#FF6B6B"
                  }
                  strokeWidth="1.5"
                  opacity={opacity}
                  style={{
                    transition: "opacity 0.3s, stroke 0.5s",
                    strokeDasharray: `${Math.PI * (radius * 2)} ${
                      Math.PI * (radius * 2)
                    }`,
                    strokeDashoffset:
                      fingerprintProgress > i * 8 ? 0 : Math.PI * (radius * 2),
                  }}
                />
              );
            })}
          </svg>

          {/* Center dot with pulse effect */}
          <div
            className={`absolute w-3 h-3 rounded-full ${
              fingerprintComplete
                ? "bg-[#34C759]"
                : "bg-[#FF6B6B] dark:bg-[#E5989B]"
            }`}
            style={{
              animation: fingerprintComplete
                ? "none"
                : "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
        </div>

        {fingerprintComplete && (
          <div className="text-[#34C759] text-[13px] font-medium animate-in fade-in duration-300">
            {t("Success")}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => {
              reset();
              onBack();
            }}
            className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
          >
            {tTouchID("SetupLater")}
          </button>
          <button
            onClick={reset}
            className="text-[#6e6e73] dark:text-[#98989d] text-[13px] font-medium hover:text-black dark:hover:text-white transition-colors"
          >
            {tCommon("Cancel")}
          </button>
        </div>
      </div>
    </SetupWindow>
  );
};
