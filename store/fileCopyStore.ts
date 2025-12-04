import { create } from "zustand";

interface FileCopyState {
  isCopying: boolean;
  operation: "copy" | "delete" | "move"; // New
  totalFiles: number;
  completedFiles: number;
  totalBytes: number;
  completedBytes: number;
  currentFilename: string;
  sourcePath: string;
  destPath: string;
  isCancelled: boolean; // New

  startCopy: (
    totalFiles: number,
    totalBytes: number,
    source: string,
    dest: string,
    operation?: "copy" | "delete" | "move" // New
  ) => void;
  updateProgress: (
    completedFiles: number,
    completedBytes: number,
    currentFile: string
  ) => void;
  cancelOperation: () => void; // New
  setTotalBytes: (totalBytes: number) => void; // New
  endCopy: () => void;
}

export const useFileCopyStore = create<FileCopyState>((set) => ({
  isCopying: false,
  operation: "copy",
  totalFiles: 0,
  completedFiles: 0,
  totalBytes: 0,
  completedBytes: 0,
  currentFilename: "",
  sourcePath: "",
  destPath: "",
  isCancelled: false,

  startCopy: (
    totalFiles,
    totalBytes,
    sourcePath,
    destPath,
    operation = "copy"
  ) =>
    set({
      isCopying: true,
      operation,
      totalFiles,
      completedFiles: 0,
      totalBytes,
      completedBytes: 0,
      currentFilename: "Preparing...",
      sourcePath,
      destPath,
      isCancelled: false,
    }),

  updateProgress: (completedFiles, completedBytes, currentFilename) =>
    set({
      completedFiles,
      completedBytes,
      currentFilename,
    }),

  cancelOperation: () => set({ isCancelled: true }),

  setTotalBytes: (totalBytes: number) => set({ totalBytes }),

  endCopy: () =>
    set({
      isCopying: false,
      operation: "copy",
      totalFiles: 0,
      completedFiles: 0,
      totalBytes: 0,
      completedBytes: 0,
      currentFilename: "",
      isCancelled: false,
    }),
}));
