import { pdfjs } from "react-pdf";

// Primary: same-origin API route served with application/javascript
// Fallback: unpkg CDN
export const PDF_WORKER_URL = "/api/pdf-worker";
export const PDF_WORKER_CDN_URL = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function configurePdfWorker(): void {
  if (typeof window === "undefined") return;

  try {
    // Setting workerSrc to same-origin /api/pdf-worker avoids cross-origin worker
    // restrictions and guarantees strict application/javascript MIME type from our Node handler.
    pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
  } catch (error) {
    console.warn("[PDFConfig] Failed to set workerSrc, falling back to CDN:", error);
    pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_CDN_URL;
  }
}

// Configure immediately at module load time
if (typeof window !== "undefined") {
  configurePdfWorker();
}
