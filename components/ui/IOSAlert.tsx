import React from "react";
import { MacOSTypography } from "./design-system/MacOSTypography";

interface IOSAlertAction {
  label: string;
  style?: "default" | "cancel" | "destructive";
  onClick: () => void;
}

interface IOSAlertProps {
  title: string;
  message?: string;
  actions: IOSAlertAction[];
  isOpen: boolean;
  onClose: () => void;
}

export const IOSAlert: React.FC<IOSAlertProps> = ({
  title,
  message,
  actions,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Alert Box */}
      <div className="relative w-[270px] bg-[var(--ios-grouped-background)]/85 backdrop-blur-xl rounded-[14px] overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
        <div className="p-4 text-center border-b border-[var(--ios-separator)]/50">
          <MacOSTypography
            variant="headline"
            className="mb-1 text-[17px] font-semibold"
          >
            {title}
          </MacOSTypography>
          {message && (
            <MacOSTypography
              variant="body"
              className="text-[13px] text-[var(--secondary-label)]"
            >
              {message}
            </MacOSTypography>
          )}
        </div>

        <div
          className={`flex ${actions.length === 2 ? "flex-row" : "flex-col"}`}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              className={`
                flex-1 h-[44px] flex items-center justify-center text-[17px] active:bg-[var(--ios-separator)]/20 transition-colors
                ${
                  index > 0 && actions.length === 2
                    ? "border-l border-[var(--ios-separator)]/50"
                    : ""
                }
                ${
                  index > 0 && actions.length !== 2
                    ? "border-t border-[var(--ios-separator)]/50"
                    : ""
                }
                ${
                  action.style === "destructive"
                    ? "text-red-500"
                    : "text-[var(--ios-system-blue)]"
                }
                ${action.style === "cancel" ? "font-semibold" : "font-normal"}
              `}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
