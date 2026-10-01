"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { ZoomIn, ZoomOut, Download, RotateCcw, PanelLeft } from "lucide-react";
import { PDFToolbarProps } from "./types";

export const PDFToolbar: React.FC<PDFToolbarProps> = ({
  fileName,
  currentPage,
  numPages,
  zoom,
  showThumbnails,
  onToggleThumbnails,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onDownload,
}) => {
  const t = useTranslations("PDFViewer");

  return (
    <div className="h-12 flex items-center justify-between px-3 bg-white/80 dark:bg-[#2c2c2e]/90 border-b border-gray-200 dark:border-black/50 shadow-xs shrink-0 backdrop-blur-md transition-colors duration-200 select-none z-10">
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleThumbnails}
          className={`p-1.5 rounded-md transition-all active:scale-95 ${
            showThumbnails
              ? "bg-gray-200 dark:bg-[#4c4c4e] text-black dark:text-white"
              : "hover:bg-gray-100 dark:hover:bg-[#3c3c3e] text-gray-600 dark:text-[#dfdfdf]"
          }`}
          title={t("View")}
          aria-label={t("View")}
        >
          <PanelLeft size={16} />
        </button>
      </div>

      {/* Center: File Name & Page Info */}
      <div className="flex flex-col items-center justify-center flex-1 overflow-hidden px-4">
        <h2 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[#dfdfdf] truncate max-w-[280px] sm:max-w-md text-center">
          {fileName}
        </h2>
        <div className="text-[10px] text-gray-500 dark:text-[#9a9a9a] font-medium tracking-tight">
          {t("PageInfo", { current: currentPage, total: numPages || "--" })} • {zoom}%
        </div>
      </div>

      {/* Right: Controls & Download */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center bg-gray-100 dark:bg-[#3a3a3c] rounded-md p-0.5 border border-gray-200 dark:border-black/20">
          <button
            onClick={onZoomOut}
            className="p-1 hover:bg-gray-200 dark:hover:bg-[#4c4c4e] rounded transition-all active:scale-90 text-gray-600 dark:text-[#dfdfdf]"
            title={t("ZoomOut")}
            aria-label={t("ZoomOut")}
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={onResetZoom}
            className="px-1.5 py-0.5 hover:bg-gray-200 dark:hover:bg-[#4c4c4e] rounded text-[11px] font-medium text-gray-600 dark:text-[#dfdfdf] transition-all"
            title={t("FitWidth")}
          >
            <RotateCcw size={12} />
          </button>
          <button
            onClick={onZoomIn}
            className="p-1 hover:bg-gray-200 dark:hover:bg-[#4c4c4e] rounded transition-all active:scale-90 text-gray-600 dark:text-[#dfdfdf]"
            title={t("ZoomIn")}
            aria-label={t("ZoomIn")}
          >
            <ZoomIn size={15} />
          </button>
        </div>

        <button
          onClick={onDownload}
          className="p-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-[#007aff]/20 dark:hover:text-[#007aff] rounded-md transition-all active:scale-90 text-gray-600 dark:text-[#dfdfdf]"
          title={t("Download")}
          aria-label={t("Aria.Download")}
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};
