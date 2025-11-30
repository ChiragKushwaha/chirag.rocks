import React from "react";
import { MacOSTypography } from "./design-system/MacOSTypography";

interface IOSActionSheetAction {
  label: string;
  style?: "default" | "cancel" | "destructive";
  onClick: () => void;
}

interface IOSActionSheetProps {
  title?: string;
  message?: string;
  actions: IOSActionSheetAction[];
  isOpen: boolean;
  onClose: () => void;
}

export const IOSActionSheet: React.FC<IOSActionSheetProps> = ({
  title,
  message,
  actions,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const cancelAction = actions.find((a) => a.style === "cancel");
  const otherActions = actions.filter((a) => a.style !== "cancel");

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Action Sheet Group */}
      <div className="relative z-10 w-full max-w-md mx-auto space-y-2 animate-in slide-in-from-bottom-10 duration-300">
        {/* Main Actions Group */}
        <div className="bg-[var(--ios-grouped-background)]/85 backdrop-blur-xl rounded-[14px] overflow-hidden">
          {(title || message) && (
            <div className="p-3.5 text-center border-b border-[var(--ios-separator)]/50">
              {title && (
                <MacOSTypography
                  variant="subhead"
                  className="text-[13px] font-semibold text-[var(--secondary-label)] mb-0.5"
                >
                  {title}
                </MacOSTypography>
              )}
              {message && (
                <MacOSTypography
                  variant="caption1"
                  className="text-[13px] text-[var(--tertiary-label)]"
                >
                  {message}
                </MacOSTypography>
              )}
            </div>
          )}

          {otherActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              className={`
                w-full h-[56px] flex items-center justify-center text-[20px] active:bg-[var(--ios-separator)]/20 transition-colors
                ${
                  index > 0 || title || message
                    ? "border-t border-[var(--ios-separator)]/50"
                    : ""
                }
                ${
                  action.style === "destructive"
                    ? "text-red-500"
                    : "text-[var(--ios-system-blue)]"
                }
              `}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        {cancelAction && (
          <button
            onClick={() => {
              cancelAction.onClick();
              onClose();
            }}
            className="w-full h-[56px] bg-white dark:bg-[#1C1C1E] rounded-[14px] text-[20px] font-semibold text-[var(--ios-system-blue)] active:bg-[var(--ios-separator)]/20 transition-colors shadow-sm"
          >
            {cancelAction.label}
          </button>
        )}
      </div>
    </div>
  );
};
