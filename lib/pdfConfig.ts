import { pdfjs } from "react-pdf";

// Configure at module load time — pdfjs resolves the worker as soon as
// a <Document> mounts, so setting this inside useEffect is too late.
// CDN avoids MIME-type issues (Hostinger hcdn serves .mjs as text/plain).
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

/** @deprecated Call is now a no-op; config runs at module import time. */
export function configurePdfWorker(): void {}
