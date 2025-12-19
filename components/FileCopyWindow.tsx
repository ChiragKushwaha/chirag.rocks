import React from "react";
import { useFileCopyStore } from "../store/fileCopyStore";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FileCopyWindow: React.FC = () => {
  const {
    isCopying,
    operation,
    totalFiles,
    completedFiles,
    totalBytes,
    completedBytes,
    currentFilename,
    destPath,
    cancelOperation,
  } = useFileCopyStore();
  const [visible, setVisible] = React.useState(false);
  const [showCancelAlert, setShowCancelAlert] = React.useState(false);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCopying) {
      timeout = setTimeout(() => {
        setVisible(true);
      }, 500); // Show after 500ms
    } else {
      // Hide immediately when done (wrapped to avoid sync state update warning)
      timeout = setTimeout(() => setVisible(false), 0);
    }
    return () => clearTimeout(timeout);
  }, [isCopying]);

  if (!visible) return null;

  // Calculate progress
  // If we have bytes, use bytes. Otherwise use files.
  let progress = 0;
  let progressText = "";

  // Helper to format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (totalBytes > 0) {
    progress = Math.min(100, (completedBytes / totalBytes) * 100);
    const completedStr = formatBytes(completedBytes);
    const totalStr = formatBytes(totalBytes);
    progressText = `${completedStr} of ${totalStr}`;
  } else if (totalFiles > 0) {
    progress = Math.min(100, (completedFiles / totalFiles) * 100);
    progressText = `${completedFiles} of ${totalFiles} items`;
  }

  const handleClose = () => {
    setShowCancelAlert(true);
  };

  const confirmCancel = () => {
    cancelOperation();
    setShowCancelAlert(false);
    setVisible(false);
  };

  const title =
    operation === "delete"
      ? "Deleting"
      : operation === "move"
      ? "Moving"
      : "Copying";
  const actionText =
    operation === "delete"
      ? "Deleting"
      : operation === "move"
      ? "Moving"
      : "Copying";
  const toText =
    operation === "delete"
      ? ""
      : operation === "move"
      ? `to "${destPath.split("/").pop() || "Destination"}"`
      : `to "${destPath.split("/").pop() || "Destination"}"`;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
          exit={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
          drag
          dragMomentum={false}
          onMouseDown={(e) => e.stopPropagation()}
          className="fixed top-1/2 left-1/2 w-[420px] bg-[#F6F6F6] dark:bg-[#2B2B2B] rounded-xl shadow-2xl border border-gray-200 dark:border-black/30 overflow-hidden z-[9999] font-sans select-none pointer-events-auto"
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between handle cursor-move">
            <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200">
              {title}
            </span>
            <button
              onClick={handleClose}
              className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={12} className="text-gray-400 dark:text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 pb-5 pt-1 flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white font-bold text-xs">FILE</span>
              </div>
              <div className="flex flex-col justify-center overflow-hidden">
                <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {actionText} &quot;{currentFilename}&quot;
                </span>
                {toText && (
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {toText}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="h-1.5 w-full bg-gray-200 dark:bg-[#404040] rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <motion.div
                  className="h-full bg-[#007AFF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                <span className="tabular-nums">{progressText}</span>
                <span className="tabular-nums">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Cancel Confirmation Alert - Big Sur Style */}
      {showCancelAlert && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[20vh]">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowCancelAlert(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-[260px] bg-[#ECECEC] dark:bg-[#323232] rounded-xl shadow-2xl border border-gray-300 dark:border-black/50 p-4 flex flex-col items-center text-center relative z-10"
          >
            <div className="w-14 h-14 mb-3">
              <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-3xl font-bold text-white mb-1">!</span>
              </div>
            </div>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">
              Stop{" "}
              {operation === "delete"
                ? "Deleting"
                : operation === "move"
                ? "Moving"
                : "Copying"}
              ?
            </h3>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 mb-4 leading-tight px-2">
              Are you sure you want to stop{" "}
              {operation === "delete"
                ? "deleting"
                : operation === "move"
                ? "moving"
                : "copying"}{" "}
              files?
            </p>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setShowCancelAlert(false)}
                className="flex-1 px-3 py-1 bg-white dark:bg-[#404040] border border-gray-300 dark:border-gray-600 rounded-md text-[13px] font-medium text-gray-800 dark:text-gray-200 shadow-sm active:bg-gray-100 dark:active:bg-[#505050] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-3 py-1 bg-[#007AFF] text-white rounded-md text-[13px] font-medium shadow-sm active:bg-blue-600 transition-colors"
              >
                Stop
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
