import React, { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

interface ExternalLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  url: string;
}

export const ExternalLinkDialog: React.FC<ExternalLinkDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  url,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const domain = new URL(url).hostname.replace("www.", "");

  return (
    <dialog
      ref={dialogRef}
      className="bg-transparent p-0 m-0 w-screen h-screen max-w-none max-h-none backdrop:bg-black/30 backdrop:backdrop-blur-sm flex items-center justify-center z-9999"
      onClick={handleBackdropClick}
      onCancel={onClose}
    >
      <div className="w-[420px] bg-[#ececec] dark:bg-[#2d2d2d] rounded-[13px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-black/10 dark:border-white/10">
        {/* Icon and Message Section */}
        <div className="flex gap-5 p-5 pb-4">
          {/* Icon */}
          <div className="shrink-0 pt-1">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-[#3a3a3a] flex items-center justify-center shadow-sm">
              <AlertTriangle
                className="w-8 h-8 text-[#ff9500]"
                strokeWidth={2.5}
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex-1 pt-1.5">
            <h3 className="text-[13px] font-bold text-[#1d1d1f] dark:text-white leading-tight mb-1.5">
              Do you want to allow this?
            </h3>
            <p className="text-[11px] text-[#1d1d1f] dark:text-[#e5e5e7] leading-[1.4] font-normal">
              This will open <span className="font-semibold">{domain}</span> in
              a new window.
            </p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex border-t border-black/10 dark:border-white/10">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-[11px] text-[13px] font-medium text-[#1d1d1f] dark:text-white bg-transparent hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors border-r border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:z-10"
          >
            Don&apos;t Allow
          </button>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-[11px] text-[13px] font-semibold text-white bg-[#007aff] hover:bg-[#0051d5] active:bg-[#004ec4] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:z-10"
          >
            Allow
          </button>
        </div>
      </div>
    </dialog>
  );
};
