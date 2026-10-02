import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const {
    data: blob,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pdf-document-blob", initialPath, fileName],
    queryFn: async () => {
      // 1. Try reading from OPFS filesystem if path is available
      if (initialPath) {
        try {
          const { fs } = await import("../lib/FileSystem");
          const fileBlob = await fs.readFileBlob(initialPath, fileName);
          if (fileBlob && fileBlob.size > 200) {
            return fileBlob;
          }
        } catch (err) {
          console.warn("[usePdfDocument] OPFS read skipped/failed:", err);
        }
      }

      // 2. Fetch using Axios and TanStack Query
      const endpoint = fileName.startsWith("/") ? fileName : `/${fileName}`;
      const fetchedBlob = await fetchBlob(endpoint);

      // 3. Cache to OPFS in background for offline & desktop access
      if (initialPath && fetchedBlob.size > 200) {
        import("../lib/FileSystem")
          .then(({ fs }) => fs.writeFile(initialPath, fileName, fetchedBlob))
          .then(() => window.dispatchEvent(new Event("file-system-change")))
          .catch((err) => console.warn("[usePdfDocument] OPFS cache failed:", err));
      }

      return fetchedBlob;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!blob) {
      setPdfUrl(null);
      return;
    }
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  return {
    pdfUrl,
    fileName,
    isLoading: isLoading && !pdfUrl,
    error: error as Error | null,
    refetch,
  };
}
