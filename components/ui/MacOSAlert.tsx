import React from "react";
import { MacOSButton } from "./MacOSButton";

interface MacOSAlertProps {
  type?: "info" | "warning" | "critical";
  title: string;
  message: string;
  onClose: () => void;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

import { useTranslations } from "next-intl";

export const MacOSAlert: React.FC<MacOSAlertProps> = ({
  type = "info",
  title,
  message,
  onClose,
  primaryAction,
  secondaryAction,
}) => {
  const t = useTranslations("Common"); // Assuming Common namespace exists or I will use a fallback
  // ...
  // Actually I need to check if Common exists.
  // If not, I'll add it.

  // Use generic app icon for now, could be passed as prop
  const iconSrc = type === "critical" ? "🛑" : "⚠️"; // Placeholder emojis

  return (
    <div className="fixed inset-0 z-9999 flex items-start justify-center pt-[100px]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-[420px] bg-[#ECECEC] dark:bg-[#2C2C2E] rounded-[10px] shadow-2xl border border-black/10 dark:border-white/10 p-5 flex gap-4 animate-in zoom-in-95 duration-100">
        <div className="text-5xl select-none">{iconSrc}</div>
        <div className="flex-1 flex flex-col">
          <h3 className="text-[13px] font-bold text-black dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-[12px] text-black/80 dark:text-white/80 leading-normal mb-4">
            {message}
          </p>
          <div className="flex justify-end gap-2">
            {secondaryAction && (
              <MacOSButton onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </MacOSButton>
            )}
            <MacOSButton
              variant={type === "critical" ? "destructive" : "primary"}
              onClick={primaryAction ? primaryAction.onClick : onClose}
            >
              {primaryAction ? primaryAction.label : t("OK")}
            </MacOSButton>
          </div>
        </div>
      </div>
    </div>
  );
};
