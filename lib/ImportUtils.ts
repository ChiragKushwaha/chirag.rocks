import { fs } from "./FileSystem";
import { useFileCopyStore } from "../store/fileCopyStore";

export const ImportUtils = {
  /**
   * Import a list of DataTransferItems (files/folders) to a target path in OPFS.
   */
  async importItems(
    items: DataTransferItemList,
    targetPath: string
  ): Promise<void> {
    const promises: Promise<void>[] = [];
    const store = useFileCopyStore.getState();

    // 1. Synchronously extract all entries/files from DataTransferItemList
    // This is crucial because DataTransferItemList is cleared after the event handler returns (which happens on first await)
    const entriesToProcess: {
      entry?: FileSystemEntry;
      file?: File;
      kind: string;
    }[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // Handle DataTransferItem
      if (item.webkitGetAsEntry) {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          entriesToProcess.push({ entry, kind: "entry" });
          continue;
        }
      }

      // Handle File object or fallback
      if (item.kind === "file" || item instanceof File) {
        const file = item.getAsFile
          ? item.getAsFile()
          : (item as unknown as File);
        if (file) {
          entriesToProcess.push({ file, kind: "file" });
        }
      }
    }

    // 2. Calculate initial known size (files only)
    let initialBytes = 0;
    for (const item of entriesToProcess) {
      if (item.kind === "file" && item.file) {
        initialBytes += item.file.size;
      }
    }

    // Track total bytes dynamically as we discover them
    let currentTotalBytes = initialBytes;

    // 3. Show window immediately with known size
    store.startCopy(
      items.length,
      currentTotalBytes,
      "External",
      targetPath,
      "copy"
    );
    store.setTotalBytes(currentTotalBytes);

    // Helper to get size of an entry recursively AND update store incrementally
    const getEntrySize = async (entry: FileSystemEntry): Promise<number> => {
      if (entry.isFile) {
        return new Promise((resolve) => {
          (entry as FileSystemFileEntry).file(
            (file) => {
              // Increment global total and update store immediately
              currentTotalBytes += file.size;
              store.setTotalBytes(currentTotalBytes);
              resolve(file.size);
            },
            () => resolve(0)
          );
        });
      } else if (entry.isDirectory) {
        const dirReader = (entry as FileSystemDirectoryEntry).createReader();
        return new Promise((resolve) => {
          dirReader.readEntries(
            async (entries) => {
              let size = 0;
              for (const e of entries) {
                size += await getEntrySize(e);
              }
              resolve(size);
            },
            () => resolve(0)
          );
        });
      }
      return 0;
    };

    // 4. Calculate total size (Async) - now updates store incrementally via getEntrySize
    let totalItems = 0;

    for (const item of entriesToProcess) {
      if (useFileCopyStore.getState().isCancelled) break;
      if (item.kind === "entry" && item.entry) {
        // getEntrySize will update currentTotalBytes internally
        await getEntrySize(item.entry);
        totalItems++;
      } else if (item.kind === "file" && item.file) {
        // Already counted in initialBytes
        totalItems++;
      }
    }

    // Final update to ensure consistency (though getEntrySize should have handled it)
    store.setTotalBytes(currentTotalBytes);

    let completedFilesCount = 0;

    // ... (progress tracking helpers)

    // Map to track progress per file for accurate global progress
    const fileProgress = new Map<string, number>();

    const onFileProgress = (fileName: string, loaded: number) => {
      if (useFileCopyStore.getState().isCancelled) return; // Check cancel
      fileProgress.set(fileName, loaded);
      const totalLoaded = Array.from(fileProgress.values()).reduce(
        (a, b) => a + b,
        0
      );
      store.updateProgress(completedFilesCount, totalLoaded, fileName);
    };

    // 3. Process Imports
    for (const item of entriesToProcess) {
      if (useFileCopyStore.getState().isCancelled) break;

      if (item.kind === "entry" && item.entry) {
        promises.push(
          this.importEntry(
            item.entry,
            targetPath,
            onFileProgress,
            () => completedFilesCount++
          )
        );
      } else if (item.kind === "file" && item.file) {
        promises.push(
          this.importFile(item.file, targetPath, onFileProgress).then(() => {
            completedFilesCount++;
          })
        );
      }
    }

    try {
      await Promise.all(promises);
      // Force flush to ensure files are on disk before UI refresh
      await fs.flush();
    } finally {
      // Small delay to show completion
      setTimeout(() => {
        store.endCopy();
      }, 500);
    }
  },

  async importHandle(
    handle: FileSystemHandle,
    targetPath: string,
    onProgress: (name: string, loaded: number) => void,
    onComplete: () => void
  ): Promise<void> {
    if (handle.kind === "file") {
      const fileHandle = handle as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      await this.importFile(file, targetPath, onProgress);
      onComplete();
    } else if (handle.kind === "directory") {
      const dirHandle = handle as FileSystemDirectoryHandle;
      const newPath = `${targetPath}/${handle.name}`;
      await fs.mkdir(newPath);

      // @ts-expect-error
      for await (const [name, subHandle] of dirHandle.entries()) {
        await this.importHandle(subHandle, newPath, onProgress, () => {});
      }
      onComplete(); // Directory complete
    }
  },

  async importEntry(
    entry: FileSystemEntry,
    targetPath: string,
    onProgress: (name: string, loaded: number) => void,
    onComplete: () => void
  ): Promise<void> {
    if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      return new Promise((resolve, reject) => {
        fileEntry.file(
          async (file) => {
            await this.importFile(file, targetPath, onProgress);
            onComplete();
            resolve();
          },
          (err) => reject(err)
        );
      });
    } else if (entry.isDirectory) {
      const dirEntry = entry as FileSystemDirectoryEntry;
      const newPath = `${targetPath}/${entry.name}`;
      await fs.mkdir(newPath);

      const reader = dirEntry.createReader();
      const readEntries = async () => {
        return new Promise<FileSystemEntry[]>((resolve, reject) => {
          reader.readEntries(
            (entries) => resolve(entries),
            (err) => reject(err)
          );
        });
      };

      let entries: FileSystemEntry[] = [];
      let batch: FileSystemEntry[];
      do {
        batch = await readEntries();
        entries = entries.concat(batch);
      } while (batch.length > 0);

      await Promise.all(
        entries.map((e) => this.importEntry(e, newPath, onProgress, () => {}))
      );
      onComplete();
    }
  },

  async importFile(
    file: File,
    targetPath: string,
    onProgress: (name: string, loaded: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(file.name, e.loaded);
        }
      };

      reader.onload = async () => {
        try {
          const content = reader.result as ArrayBuffer;
          await fs.writeFile(targetPath, file.name, content);
          onProgress(file.name, file.size); // Ensure 100%
          resolve();
        } catch (e) {
          reject(e);
        }
      };

      reader.onerror = () => reject(reader.error);

      reader.readAsArrayBuffer(file);
    });
  },
};
