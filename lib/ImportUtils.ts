import { fs } from "./FileSystem";

export const ImportUtils = {
  /**
   * Import a list of DataTransferItems (files/folders) to a target path in OPFS.
   */
  async importItems(
    items: DataTransferItemList,
    targetPath: string
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind !== "file") continue;

      // Modern API: getAsFileSystemHandle
      // @ts-ignore
      if (item.getAsFileSystemHandle) {
        // @ts-ignore
        const handle = await item.getAsFileSystemHandle();
        if (handle) {
          promises.push(this.importHandle(handle, targetPath));
          continue;
        }
      }

      // Fallback: webkitGetAsEntry
      const entry = item.webkitGetAsEntry();
      if (entry) {
        promises.push(this.importEntry(entry, targetPath));
        continue;
      }

      // Fallback: getAsFile (flat file only)
      const file = item.getAsFile();
      if (file) {
        promises.push(this.importFile(file, targetPath));
      }
    }

    await Promise.all(promises);
  },

  async importHandle(
    handle: FileSystemHandle,
    targetPath: string
  ): Promise<void> {
    if (handle.kind === "file") {
      const fileHandle = handle as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      await this.importFile(file, targetPath);
    } else if (handle.kind === "directory") {
      const dirHandle = handle as FileSystemDirectoryHandle;
      const newPath = `${targetPath}/${handle.name}`;
      await fs.mkdir(newPath);

      // @ts-ignore - entries() is async iterable in modern browsers
      for await (const [name, subHandle] of dirHandle.entries()) {
        await this.importHandle(subHandle, newPath);
      }
    }
  },

  async importEntry(entry: FileSystemEntry, targetPath: string): Promise<void> {
    if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      return new Promise((resolve, reject) => {
        fileEntry.file(
          async (file) => {
            await this.importFile(file, targetPath);
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

      await Promise.all(entries.map((e) => this.importEntry(e, newPath)));
    }
  },

  async importFile(file: File, targetPath: string): Promise<void> {
    const content = await file.arrayBuffer();
    await fs.writeFile(targetPath, file.name, content);
  },
};
