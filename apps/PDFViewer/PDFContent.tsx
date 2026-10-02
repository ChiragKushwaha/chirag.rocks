"use client";
import React, { useRef } from "react";
import "../../lib/pdfConfig"; // must be imported before react-pdf to configure the worker URL
import { Document, Page } from "react-pdf";
import { useTranslations } from "next-intl";
import { RefreshCw, AlertCircle } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { PDFContentProps } from "./types";

export const PDFContent: React.FC<PDFContentProps> = ({
  pdfUrl,
  currentPage,
  zoom,
  isLoading,
  error,
  onLoadSuccess,
  onLoadError,
  onDocumentClick,
  onRetry,
}) => {
  const t = useTranslations("PDFViewer");
  const containerRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#e8e8e8] dark:bg-[#1a1a1a]">
        <div className="flex flex-col items-center gap-3 p-6 bg-white/70 dark:bg-[#2c2c2e]/70 backdrop-blur-md rounded-2xl shadow-lg border border-black/5 dark:border-white/10 animate-fade-in">
          <div className="w-8 h-8 rounded-full border-3 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{t("Loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-[#e8e8e8] dark:bg-[#1a1a1a]">
        <div className="flex flex-col items-center gap-3 p-6 max-w-sm text-center bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-lg border border-red-500/20 animate-fade-in">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t("FailedToLoad")}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{error?.message || t("NoPDFLoaded")}</p>
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-[#e8e8e8] dark:bg-[#181818] flex justify-center p-4 sm:p-8 relative custom-scrollbar transition-colors duration-200"
      onClick={onDocumentClick}
    >
      <div className="shadow-2xl rounded-xs overflow-hidden h-fit transition-transform duration-150 origin-top">
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => onLoadSuccess(numPages)}
          onLoadError={onLoadError}
          loading={
            <div className="w-[600px] h-[800px] bg-white dark:bg-[#252525] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-3 border-blue-500 border-t-transparent animate-spin" />
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            scale={zoom / 100}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="bg-white shadow-md"
          />
        </Document>
      </div>
    </div>
  );
};
