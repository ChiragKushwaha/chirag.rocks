import React from "react";
import { Moon, Sun, Check } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useSystemStore } from "../../../store/systemStore";

interface ThemeStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const ThemeStep: React.FC<ThemeStepProps> = ({ onNext, onBack }) => {
  const { theme, setTheme } = useSystemStore();

  return (
    <SetupWindow
      title="Select Your Appearance"
      description="Select Light or Dark appearance. The system interface and apps will adapt automatically."
      icon={Moon}
      onContinue={onNext}
      onBack={onBack}
    >
      <div className="flex gap-8 mt-4">
        {/* Light Mode Option */}
        <div
          onClick={() => setTheme("light")}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div
            className={`
              w-[190px] h-[130px] rounded-[10px] border transition-all duration-200 relative overflow-hidden shadow-sm group-hover:shadow-md
              ${
                theme === "light"
                  ? "border-[#007AFF] ring-[3px] ring-[#007AFF]/30"
                  : "border-[#D1D1D6] dark:border-[#38383A] opacity-70 hover:opacity-100"
              }
            `}
          >
            <div className="absolute inset-0 bg-[#F5F5F7]">
              <div className="h-[22px] bg-white border-b border-[#D1D1D6] flex items-center px-2 space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FF5F57] shadow-sm" />
                <div className="w-2 h-2 rounded-full bg-[#FEBC2E] shadow-sm" />
                <div className="w-2 h-2 rounded-full bg-[#28C840] shadow-sm" />
              </div>
              <div className="p-4 flex items-center justify-center h-full pb-8">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
                  <Sun className="text-gray-400" size={32} />
                </div>
              </div>
            </div>
            {/* Checkmark Badge */}
            {theme === "light" && (
              <div className="absolute bottom-2 right-2 bg-[#007AFF] text-white rounded-full p-0.5 shadow-sm scale-in-center animate-in fade-in zoom-in duration-200">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
          </div>
          <span
            className={`text-[13px] font-medium ${
              theme === "light"
                ? "text-black dark:text-white"
                : "text-[#6e6e73] dark:text-[#98989d]"
            }`}
          >
            Light
          </span>
        </div>

        {/* Dark Mode Option */}
        <div
          onClick={() => setTheme("dark")}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div
            className={`
              w-[190px] h-[130px] rounded-[10px] border transition-all duration-200 relative overflow-hidden shadow-sm group-hover:shadow-md
              ${
                theme === "dark"
                  ? "border-[#007AFF] ring-[3px] ring-[#007AFF]/30"
                  : "border-[#D1D1D6] dark:border-[#38383A] opacity-70 hover:opacity-100"
              }
            `}
          >
            <div className="absolute inset-0 bg-[#1E1E1E]">
              <div className="h-[22px] bg-[#2C2C2E] border-b border-black/50 flex items-center px-2 space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-[#5E5E5E]" />
                <div className="w-2 h-2 rounded-full bg-[#5E5E5E]" />
                <div className="w-2 h-2 rounded-full bg-[#5E5E5E]" />
              </div>
              <div className="p-4 flex items-center justify-center h-full pb-8">
                <div className="w-16 h-16 rounded-full bg-[#3A3A3C] shadow-md flex items-center justify-center">
                  <Moon className="text-gray-200" size={32} />
                </div>
              </div>
            </div>
            {theme === "dark" && (
              <div className="absolute bottom-2 right-2 bg-[#007AFF] text-white rounded-full p-0.5 shadow-sm scale-in-center animate-in fade-in zoom-in duration-200">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
          </div>
          <span
            className={`text-[13px] font-medium ${
              theme === "dark"
                ? "text-black dark:text-white"
                : "text-[#6e6e73] dark:text-[#98989d]"
            }`}
          >
            Dark
          </span>
        </div>
      </div>
    </SetupWindow>
  );
};
