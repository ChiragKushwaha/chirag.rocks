export const SUPPORTED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "ico",
  "heic",
  "psd",
  "ai",
  "tiff",
  "tif",
];

export const ImageLoader = {
  isSupported(filename: string): boolean {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext ? SUPPORTED_EXTENSIONS.includes(ext) : false;
  },

  async loadImage(file: File): Promise<string> {
    if (typeof window === "undefined") return ""; // Safety check

    const ext = file.name.split(".").pop()?.toLowerCase();

    try {
      // Native Formats
      if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg", "ico"].includes(ext || "")
      ) {
        return URL.createObjectURL(file);
      }

      // HEIC
      if (ext === "heic") {
        const heic2any = (await import("heic2any")).default;
        const blob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });
        return URL.createObjectURL(Array.isArray(blob) ? blob[0] : blob);
      }

      // TIFF
      if (ext === "tiff" || ext === "tif") {
        // @ts-expect-error
        const UTIF = (await import("utif")).default;
        const buffer = await file.arrayBuffer();
        const ifds = UTIF.decode(buffer);
        if (ifds.length > 0) {
          UTIF.decodeImage(buffer, ifds[0]);
          const rgba = UTIF.toRGBA8(ifds[0]);
          const width = ifds[0].width;
          const height = ifds[0].height;

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const imageData = ctx.createImageData(width, height);
            imageData.data.set(rgba);
            ctx.putImageData(imageData, 0, 0);
            return new Promise((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) resolve(URL.createObjectURL(blob));
                else resolve(""); // Fallback
              }, "image/jpeg");
            });
          }
        }
      }

      // PSD (using ag-psd)
      if (ext === "psd") {
        const { readPsd } = await import("ag-psd");
        const buffer = await file.arrayBuffer();
        const psd = readPsd(buffer);
        if (psd && psd.canvas) {
          // @ts-expect-error
          return psd.canvas.toDataURL();
        }
        return "";
      }

      // AI (Adobe Illustrator) - often PDF compatible
      if (ext === "ai") {
        // @ts-expect-error
        const pdfjsLib = await import("pdfjs-dist/build/pdf");
        // @ts-expect-error
        if (
          pdfjsLib.GlobalWorkerOptions &&
          !pdfjsLib.GlobalWorkerOptions.workerSrc
        ) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          return new Promise((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) resolve(URL.createObjectURL(blob));
              else resolve("");
            });
          });
        }
      }
    } catch (e) {
      console.error(`Failed to load image ${file.name}:`, e);
    }

    // Fallback: return native URL (might show broken image but better than crash)
    return URL.createObjectURL(file);
  },
};
