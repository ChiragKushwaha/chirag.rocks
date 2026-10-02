// No top-level import to avoid SSR issues
// import * as pdfjsLib from "pdfjs-dist";
import { PDF_WORKER_URL } from "./pdfConfig";

export const generatePDFThumbnail = async (blob: Blob): Promise<string> => {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import("pdfjs-dist");

    // Set worker source to same-origin API route to prevent MIME type errors
    if (
      typeof window !== "undefined" &&
      !pdfjsLib.GlobalWorkerOptions.workerSrc
    ) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
    }

    const arrayBuffer = await blob.arrayBuffer();
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
    });

    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    // Render the page
    const scale = 1.5; // Higher scale for better quality
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas context not available");
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render(renderContext as any).promise;

    // Convert to data URL
    return canvas.toDataURL();
  } catch (error) {
    console.error("Error generating PDF thumbnail:", error);
    return "";
  }
};
