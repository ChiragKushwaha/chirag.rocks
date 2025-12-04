import React from "react";
import Image from "next/image";

interface PermissionDialogProps {
  isOpen: boolean;
  appName: string;
  icon: React.ReactNode | string;
  title: string;
  description: string;
  onAllow: () => void;
  onDeny: () => void;
  isBlocked?: boolean;
}

export const PermissionDialog: React.FC<PermissionDialogProps> = ({
  isOpen,
  appName,
  icon,
  title,
  description,
  onAllow,
  onDeny,
  isBlocked = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Dialog Window */}
      <div
        className="relative w-[260px] bg-[#F6F6F6]/90 dark:bg-[#2C2C2E]/90 backdrop-blur-xl rounded-[14px] shadow-2xl border border-white/20 dark:border-white/10 flex flex-col items-center text-center p-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="permission-dialog-title"
      >
        {/* App Icon */}
        <div className="mb-3">
          {typeof icon === "string" &&
          (icon.startsWith("/") || icon.startsWith("http")) ? (
            <div className="w-12 h-12 relative">
              <Image src={icon} alt={appName} fill className="object-contain" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl">
              {icon}
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          id="permission-dialog-title"
          className="text-[13px] font-bold text-black dark:text-white mb-1 leading-tight"
        >
          {isBlocked
            ? `Permission Blocked for "${appName}"`
            : `"${appName}" would like to access your ${title}`}
        </h3>

        {/* Description */}
        <div className="text-[11px] text-black/80 dark:text-white/80 mb-4 leading-relaxed">
          {isBlocked ? (
            <div className="flex flex-col gap-2">
              <p>
                You have previously denied access. To enable it, please follow
                these steps:
              </p>
              <ol className="text-left list-decimal pl-4 space-y-1">
                <li>Click the lock icon 🔒 in your browser address bar.</li>
                <li>Find &quot;{title}&quot; setting.</li>
                <li>Change it to &quot;Allow&quot; or &quot;Ask&quot;.</li>
                <li>Reload the page.</li>
              </ol>
            </div>
          ) : (
            description
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col w-full gap-px bg-gray-300 dark:bg-gray-600 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
          {isBlocked ? (
            <button
              onClick={onDeny}
              className="w-full py-2 bg-white dark:bg-[#3A3A3C] hover:bg-[#F0F0F0] dark:hover:bg-[#48484A] text-[#007AFF] text-[13px] font-medium transition-colors active:bg-[#E5E5E5] dark:active:bg-[#505052]"
            >
              OK
            </button>
          ) : (
            <>
              <button
                onClick={onAllow}
                className="w-full py-2 bg-white dark:bg-[#3A3A3C] hover:bg-[#F0F0F0] dark:hover:bg-[#48484A] text-[#007AFF] text-[13px] font-medium transition-colors active:bg-[#E5E5E5] dark:active:bg-[#505052]"
              >
                Allow
              </button>
              <button
                onClick={onDeny}
                className="w-full py-2 bg-white dark:bg-[#3A3A3C] hover:bg-[#F0F0F0] dark:hover:bg-[#48484A] text-[#FF3B30] text-[13px] font-medium transition-colors active:bg-[#E5E5E5] dark:active:bg-[#505052]"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
