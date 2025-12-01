"use client";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut, Download } from "lucide-react";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  initialPath?: string;
  initialFilename?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  initialPath,
  initialFilename,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [fileName, setFileName] = useState(initialFilename || "Document.pdf");

  useEffect(() => {
    console.log("[PDFViewer] Mounted with:", { initialPath, initialFilename });
    if (initialPath && initialFilename) {
      loadPDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPath, initialFilename]);

  const loadPDF = async () => {
    console.log("[PDFViewer] loadPDF started");
    try {
      if (initialPath && initialFilename) {
        // Try to load from OPFS
        const { fs } = await import("../lib/FileSystem");
        console.log("[PDFViewer] fs imported");

        try {
          const blob = await fs.readFileBlob(initialPath, initialFilename);
          console.log("[PDFViewer] blob loaded:", blob);
          if (blob) {
            const url = URL.createObjectURL(blob);
            console.log("[PDFViewer] url created:", url);
            setPdfUrl(url);
            setFileName(initialFilename);
          } else {
            console.error("[PDFViewer] Failed to load PDF blob from OPFS");
            // Fallback
            if (initialFilename === "Resume.pdf") {
              console.log("[PDFViewer] Fallback to /Resume.pdf");
              setPdfUrl("/Resume.pdf");
            }
          }
        } catch (error) {
          console.error("[PDFViewer] Failed to load PDF from OPFS:", error);
          // Fallback to public folder if it's Resume.pdf
          if (initialFilename === "Resume.pdf") {
            setPdfUrl("/Resume.pdf");
          }
        }
      }
    } catch (error) {
      console.error("[PDFViewer] Error loading PDF:", error);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("[PDFViewer] Document loaded successfully, pages:", numPages);
    setNumPages(numPages);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = fileName;
      a.click();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fafafa] dark:bg-[#1e1e1e] text-gray-900 dark:text-[#dfdfdf] font-sans transition-colors duration-200">
      {/* Toolbar - macOS Preview Style */}
      <div className="h-12 flex items-center justify-between px-3 bg-white/80 dark:bg-[#2c2c2e] border-b border-gray-200 dark:border-black/50 shadow-sm shrink-0 backdrop-blur-md transition-colors duration-200">
        {/* Left: Sidebar Toggle */}
        <div className="flex items-center">
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-1.5 rounded-md transition-colors ${
              showThumbnails
                ? "bg-gray-200 dark:bg-[#4c4c4e] text-black dark:text-white"
                : "hover:bg-gray-200 dark:hover:bg-[#4c4c4e] text-gray-600 dark:text-[#dfdfdf]"
            }`}
            title="View"
          >
            <div className="w-4 h-4 border-2 border-current rounded-[2px] flex">
              <div className="w-1.5 border-r border-current h-full bg-current opacity-50"></div>
            </div>
          </button>
        </div>

        {/* Center: File Name & Page Info */}
        <div className="flex flex-col items-center justify-center flex-1 overflow-hidden px-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-[#dfdfdf] truncate w-full text-center">
            {fileName}
          </h2>
          <div className="text-[10px] text-gray-500 dark:text-[#9a9a9a] font-medium">
            Page {currentPage} of {numPages || "--"}
          </div>
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-gray-100 dark:bg-[#3a3a3c] rounded-md p-0.5 border border-gray-200 dark:border-black/20">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-gray-200 dark:hover:bg-[#4c4c4e] rounded transition-colors text-gray-600 dark:text-[#dfdfdf]"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <div className="w-px h-3 bg-gray-300 dark:bg-[#5a5a5c] mx-1" />
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-gray-200 dark:hover:bg-[#4c4c4e] rounded transition-colors text-gray-600 dark:text-[#dfdfdf]"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="w-2" />

          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#4c4c4e] rounded-md transition-colors text-gray-600 dark:text-[#dfdfdf]">
            <Download size={18} onClick={handleDownload} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showThumbnails && (
          <div className="w-[220px] bg-gray-50 dark:bg-[#262626] border-r border-gray-200 dark:border-black/50 flex flex-col shrink-0 transition-colors duration-200">
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              {pdfUrl && numPages > 0 ? (
                <Document
                  file={pdfUrl}
                  className="space-y-4"
                  loading={
                    <div className="p-4 text-center text-gray-400 dark:text-[#9a9a9a] text-xs">
                      Loading thumbnails...
                    </div>
                  }
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <div
                      key={`thumb_${index + 1}`}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <button
                        onClick={() => setCurrentPage(index + 1)}
                        className={`
                          relative transition-all duration-200
                          ${
                            currentPage === index + 1
                              ? "ring-4 ring-blue-500/50 dark:ring-[#007AFF]/50 rounded-sm"
                              : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-[#9a9a9a]/30 rounded-sm"
                          }
                        `}
                      >
                        <div className="bg-white pointer-events-none shadow-md border border-gray-200 dark:border-transparent">
                          <Page
                            pageNumber={index + 1}
                            width={140}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="block"
                          />
                        </div>
                      </button>
                      <span
                        className={`
                        text-[11px] font-medium px-2 py-0.5 rounded-full
                        ${
                          currentPage === index + 1
                            ? "bg-blue-500 dark:bg-[#007AFF] text-white"
                            : "text-gray-500 dark:text-[#9a9a9a] group-hover:text-gray-900 dark:group-hover:text-[#dfdfdf]"
                        }
                      `}
                      >
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </Document>
              ) : (
                <div className="p-4 text-center text-gray-400 dark:text-[#9a9a9a] text-xs">
                  {pdfUrl ? "Loading..." : "No PDF"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Viewer */}
        <div className="flex-1 overflow-auto bg-[#e8e8e8] dark:bg-[#1e1e1e] flex justify-center p-8 relative transition-colors duration-200">
          {pdfUrl ? (
            <div
              className="relative transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div className="shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center h-[800px] w-[600px] bg-white dark:bg-[#2c2c2e]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 dark:border-[#9a9a9a]"></div>
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center h-[800px] w-[600px] bg-white dark:bg-[#2c2c2e] text-red-500 dark:text-red-400">
                      Failed to load PDF
                    </div>
                  }
                  onLoadError={(error) =>
                    console.error("PDF Load Error:", error)
                  }
                >
                  <Page
                    pageNumber={currentPage}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="bg-white"
                    width={800}
                  />
                </Document>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-[#9a9a9a]">
              <div className="text-center">
                <p>No PDF loaded</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
