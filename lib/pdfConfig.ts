import { pdfjs } from "react-pdf";

let isWorkerConfigured = false;

export function configurePdfWorker(): void {
  if (typeof window === "undefined" || isWorkerConfigured) return;

  try {
    // Prefer local minified worker matching pdfjs-dist 5.4.296
    const origin = window.location.origin;
    pdfjs.GlobalWorkerOptions.workerSrc = `${origin}/pdf.worker.min.mjs`;
    isWorkerConfigured = true;
  } catch (error) {
    console.warn("[PDF] Failed to configure local worker, using unpkg fallback:", error);
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    isWorkerConfigured = true;
  }
}
