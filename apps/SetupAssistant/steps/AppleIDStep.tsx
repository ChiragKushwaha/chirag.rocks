import React, { useState } from "react";
import { Cloud, Globe, Users } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useTranslations } from "next-intl";

interface AppleIDStepProps {
  onNext: () => void;
  onBack: () => void;
  onCreateAppleID: () => void;
  appleID: string;
  setAppleID: (id: string) => void;
}

export const AppleIDStep: React.FC<AppleIDStepProps> = ({
  onNext,
  onBack,
  onCreateAppleID,
  appleID,
  setAppleID,
}) => {
  const t = useTranslations("Setup.AppleID");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!appleID.trim()) {
      setError(t("ErrorRequired"));
      return;
    }
    // In a real app, we would validate the Apple ID format and authenticate
    onNext();
  };

  const handleSimulationLink = (message: string) => {
    alert(`[Simulation] ${message}`);
  };

  return (
    <SetupWindow
      title={t("Title")}
      icon={Cloud}
      onContinue={handleContinue}
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
      <div className="max-w-md space-y-6">
        {/* Apple Services Icons */}
        <div className="flex justify-center gap-2 mb-6">
          {[Cloud, Globe, Globe, Cloud, Globe].map((Icon, idx) => (
            <div
              key={idx}
              className="w-12 h-12 bg-linear-to-b from-[#007AFF] to-[#0055B3] rounded-xl flex items-center justify-center shadow-md"
            >
              <Icon size={20} className="text-white" />
            </div>
          ))}
        </div>

        <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center leading-relaxed">
          {t("Description")}
        </p>

        {/* Apple ID Input */}
        <div className="space-y-2">
          <label className="text-[13px] text-black dark:text-white">
            {t("Label")}
          </label>
          <input
            type="email"
            value={appleID}
            onChange={(e) => {
              setAppleID(e.target.value);
              setError("");
            }}
            className={`w-full bg-white dark:bg-[#1C1C1E] border rounded-md px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-[#D1D1D6] dark:border-[#38383A]"
            }`}
            placeholder=""
          />
          {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
        </div>

        {/* Links */}
        <div className="space-y-2 text-center">
          <button
            onClick={onCreateAppleID}
            className="text-[#007AFF] text-[13px] hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
          >
            {t("CreateNew")}
          </button>
          <br />
          <button
            onClick={() =>
              handleSimulationLink(
                "This would open the password recovery flow."
              )
            }
            className="text-[#007AFF] text-[13px] hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
          >
            {t("Forgot")}
          </button>
          <br />
          <button
            onClick={() =>
              handleSimulationLink(
                "This would allow using different IDs for media and iCloud."
              )
            }
            className="text-[#007AFF] text-[13px] hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
          >
            {t("UseDifferent")}
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-6 text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Users size={32} className="text-[#007AFF]" />
          </div>
          <p className="text-[#6e6e73] dark:text-[#98989d] text-[11px] leading-relaxed">
            {t("Info")}
          </p>
          <button
            onClick={() =>
              handleSimulationLink("This would show data privacy details.")
            }
            className="text-[#007AFF] text-[11px] hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
          >
            {t("SeeData")}
          </button>
        </div>
      </div>
    </SetupWindow>
  );
};
