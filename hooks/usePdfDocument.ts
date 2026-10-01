import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchBlob } from "../lib/apiClient";

interface UsePdfDocumentParams {
  initialPath?: string;
  initialFilename?: string;
}

interface PdfDocumentResult {
  pdfUrl: string | null;
  fileName: string;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePdfDocument({
  initialPath,
  initialFilename,
}: UsePdfDocumentParams): PdfDocumentResult {
  const fileName = initialFilename || "Resume.pdf";
  const prevBlobUrlRef = useRef<string | null>(null);

  const { data: pdfUrl, isLoading, error, refetch } = useQuery({
    queryKey: ["pdf-document", initialPath, fileName],
    queryFn: async () => {
      // 1. Try reading from OPFS filesystem if path is available
      if (initialPath) {
        try {
          const { fs } = await import("../lib/FileSystem");
          const blob = await fs.readFileBlob(initialPath, fileName);
          if (blob && blob.size > 200) {
            const url = URL.createObjectURL(blob);
            return url;
          }
        } catch (err) {
          console.warn("[usePdfDocument] OPFS read skipped/failed:", err);
        }
      }

      // 2. Fetch using Axios and TanStack Query
      const endpoint = fileName.startsWith("/") ? fileName : `/${fileName}`;
      const blob = await fetchBlob(endpoint);
      const url = URL.createObjectURL(blob);

      // 3. Cache to OPFS in background for offline & desktop access
      if (initialPath && blob.size > 200) {
        import("../lib/FileSystem")
          .then(({ fs }) => fs.writeFile(initialPath, fileName, blob))
          .then(() => window.dispatchEvent(new Event("file-system-change")))
          .catch((err) => console.warn("[usePdfDocument] OPFS cache failed:", err));
      }

      return url;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Clean up previous blob URLs to prevent memory leaks
  useEffect(() => {
    if (pdfUrl && pdfUrl !== prevBlobUrlRef.current) {
      if (prevBlobUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
      }
      prevBlobUrlRef.current = pdfUrl;
    }
  }, [pdfUrl]);

  useEffect(() => {
    return () => {
      if (prevBlobUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
      }
    };
  }, []);

  return {
    pdfUrl: pdfUrl || null,
    fileName,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
