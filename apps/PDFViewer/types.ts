export interface PDFViewerProps {
  initialPath?: string;
  initialFilename?: string;
}

export interface PDFToolbarProps {
  fileName: string;
  currentPage: number;
  numPages: number;
  zoom: number;
  showThumbnails: boolean;
  onToggleThumbnails: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onDownload: () => void;
}

export interface PDFSidebarProps {
  pdfUrl: string;
  numPages: number;
  currentPage: number;
  onSelectPage: (page: number) => void;
}

export interface PDFContentProps {
  pdfUrl: string | null;
  currentPage: number;
  zoom: number;
  isLoading: boolean;
  error: Error | null;
  onLoadSuccess: (numPages: number) => void;
  onLoadError: (err: Error) => void;
  onDocumentClick: (e: React.MouseEvent) => void;
  onRetry: () => void;
}
