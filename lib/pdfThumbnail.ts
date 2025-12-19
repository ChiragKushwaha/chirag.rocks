// No top-level import to avoid SSR issues
// import * as pdfjsLib from "pdfjs-dist";

export const generatePDFThumbnail = async (blob: Blob): Promise<string> => {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import("pdfjs-dist");

    // Set worker source
    if (
      typeof window !== "undefined" &&
      !pdfjsLib.GlobalWorkerOptions.workerSrc
    ) {
      // Use the local worker file we copied to public/
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }

    const arrayBuffer = await blob.arrayBuffer();
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.449/cmaps/",
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
