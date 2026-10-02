import { pdfjs } from "react-pdf";

let isWorkerConfigured = false;

export function configurePdfWorker(): void {
  if (typeof window === "undefined" || isWorkerConfigured) return;

  // Use CDN as primary source — avoids MIME type issues on any hosting environment.
  // The version must match pdfjs-dist exactly (react-pdf@10.5.0 ships 5.4.296).
  const version = pdfjs.version;
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  isWorkerConfigured = true;
}
