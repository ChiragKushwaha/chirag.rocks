"use client";
import React from "react";
import "../../lib/pdfConfig";
import { Document, Page } from "react-pdf";
import { useTranslations } from "next-intl";
import { PDFSidebarProps } from "./types";

export const PDFSidebar: React.FC<PDFSidebarProps> = ({
  pdfUrl,
  numPages,
  currentPage,
  onSelectPage,
}) => {
  const t = useTranslations("PDFViewer");

  return (
    <aside className="w-[180px] sm:w-[210px] bg-gray-50/95 dark:bg-[#242426]/95 border-r border-gray-200 dark:border-black/50 flex flex-col shrink-0 transition-all duration-200 select-none backdrop-blur-md">
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {numPages > 0 ? (
          <Document
            file={pdfUrl}
            className="space-y-4"
            loading={
              <div className="p-4 text-center text-gray-400 dark:text-[#9a9a9a] text-xs">
                {t("LoadingThumbnails")}
              </div>
            }
          >
            {Array.from({ length: numPages }, (_, index) => {
              const pageNum = index + 1;
              const isSelected = currentPage === pageNum;

              return (
                <div
                  key={`thumb_${pageNum}`}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  onClick={() => onSelectPage(pageNum)}
                >
                  <div
                    className={`relative rounded-xs transition-all duration-150 transform group-hover:scale-[1.02] shadow-sm ${
                      isSelected
                        ? "ring-3 ring-blue-500 shadow-md"
                        : "ring-1 ring-black/10 dark:ring-white/10 group-hover:ring-black/30"
                    }`}
                  >
                    <div className="bg-white pointer-events-none overflow-hidden rounded-xs">
                      <Page
                        pageNumber={pageNum}
                        width={130}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="block"
                      />
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? "bg-blue-500 text-white font-semibold"
                        : "text-gray-500 dark:text-[#9a9a9a] group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </span>
                </div>
              );
            })}
          </Document>
        ) : (
          <div className="p-4 text-center text-gray-400 dark:text-[#9a9a9a] text-xs">
            {t("Loading")}
          </div>
        )}
      </div>
    </aside>
  );
};
