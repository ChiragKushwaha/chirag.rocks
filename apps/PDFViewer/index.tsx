"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { configurePdfWorker } from "../../lib/pdfConfig";
import { usePdfDocument } from "../../hooks/usePdfDocument";
import { useProcessStore } from "../../store/processStore";
import { Safari } from "../Safari";
import { PDFToolbar } from "./PDFToolbar";
import { PDFSidebar } from "./PDFSidebar";
import { PDFContent } from "./PDFContent";
import { PDFViewerProps } from "./types";

export const PDFViewer: React.FC<PDFViewerProps> = ({
  initialPath,
  initialFilename,
}) => {
  useEffect(() => {
    configurePdfWorker();
  }, []);

  const { pdfUrl, fileName, isLoading, error, refetch } = usePdfDocument({
    initialPath,
    initialFilename,
  });

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);
  const { launchProcess, processes, focusProcess } = useProcessStore();

  const handleDownload = useCallback(() => {
    if (!pdfUrl) return;
    const anchor = document.createElement("a");
    anchor.href = pdfUrl;
    anchor.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, [pdfUrl, fileName]);

  const handleDocumentClick = useCallback(
    (e: React.MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link?.href) return;
      e.preventDefault();
      e.stopPropagation();

      const url = link.href;
      const safari = processes.find((p) => p.id === "safari");
      if (safari) {
        window.dispatchEvent(new CustomEvent("safari:open-url", { detail: { url } }));
        focusProcess(safari.pid);
      } else {
        launchProcess(
          "safari",
          "Safari",
          ({ className }: { className?: string }) => (
            <div className={`${className} relative`}>
              <Image src="/icons/safari.webp" alt="Safari" fill className="object-contain drop-shadow-lg" />
            </div>
          ),
          <Safari initialUrl={url} />
        );
      }
    },
    [processes, focusProcess, launchProcess]
  );

  return (
    <div className="flex flex-col h-full bg-[#fafafa] dark:bg-[#1e1e1e] text-gray-900 dark:text-[#dfdfdf] font-sans overflow-hidden">
      <PDFToolbar
        fileName={fileName}
        currentPage={currentPage}
        numPages={numPages}
        zoom={zoom}
        showThumbnails={showThumbnails}
        onToggleThumbnails={() => setShowThumbnails((prev) => !prev)}
        onZoomIn={() => setZoom((prev) => Math.min(prev + 25, 250))}
        onZoomOut={() => setZoom((prev) => Math.max(prev - 25, 50))}
        onResetZoom={() => setZoom(100)}
        onDownload={handleDownload}
      />
      <div className="flex flex-1 overflow-hidden">
        {showThumbnails && pdfUrl && (
          <PDFSidebar
            pdfUrl={pdfUrl}
            numPages={numPages}
            currentPage={currentPage}
            onSelectPage={setCurrentPage}
          />
        )}
        <PDFContent
          pdfUrl={pdfUrl}
          currentPage={currentPage}
          zoom={zoom}
          isLoading={isLoading}
          error={error}
          onLoadSuccess={(pages) => setNumPages(pages)}
          onLoadError={(err) => console.error("[PDFViewer] Page load error:", err)}
          onDocumentClick={handleDocumentClick}
          onRetry={refetch}
        />
      </div>
    </div>
  );
};
