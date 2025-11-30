// FileSystem.ts
import { MacFileEntry } from "./types";

export class MacFileSystem {
  private root: FileSystemDirectoryHandle | null = null;

  /**
   * Initialize connection to Origin Private File System
   */
  async init(): Promise<void> {
    if (!this.root) {
      this.root = await navigator.storage.getDirectory();
    }
  }

  /**
   * Resolve a path string to a Directory Handle.
   * Creates directories if create=true (mkdir -p)
   */
  private async resolvePath(
    path: string,
    create: boolean = false
  ): Promise<FileSystemDirectoryHandle> {
    await this.init();
    if (!this.root) throw new Error("FileSystem not initialized");

    const parts = path.split("/").filter((p) => p.length > 0);
    let currentDir = this.root;

    for (const part of parts) {
      currentDir = await currentDir.getDirectoryHandle(part, { create });
    }
    return currentDir;
  }

  async readFile(path: string, filename: string): Promise<string> {
    try {
      const dirHandle = await this.resolvePath(path);
      const fileHandle = await dirHandle.getFileHandle(filename);
      const file = await fileHandle.getFile();
      return await file.text();
    } catch (e) {
      console.error(`[FS] Read Error: ${path}/${filename}`, e);
      return "";
    }
  }

  /**
   * Create a directory recursively (mkdir -p)
   */
  async mkdir(path: string): Promise<boolean> {
    try {
      await this.resolvePath(path, true);
      console.log(`[FS] Created Directory: ${path}`);
      return true;
    } catch (e) {
      console.error(`[FS] Error creating directory ${path}:`, e);
      return false;
    }
  }

  /**
   * Write content to a file. Creates path if missing.
   */
  async writeFile(
    path: string,
    filename: string,
    content: string
  ): Promise<void> {
    try {
      const dirHandle = await this.resolvePath(path, true);
      const fileHandle = await dirHandle.getFileHandle(filename, {
        create: true,
      });

      // specific OPFS writing stream
      const writable = await (fileHandle as any).createWritable();
      await writable.write(content);
      await writable.close();

      console.log(`[FS] Wrote File: ${path}/${filename}`);
    } catch (e) {
      console.error(`[FS] Error writing file ${filename}:`, e);
    }
  }

  /**
   * Write binary content (Blob/Buffer) to a file.
   */
  async writeBlob(
    path: string,
    filename: string,
    content: Blob | ArrayBuffer
  ): Promise<void> {
    try {
      const dirHandle = await this.resolvePath(path, true);
      const fileHandle = await dirHandle.getFileHandle(filename, {
        create: true,
      });

      const writable = await (fileHandle as any).createWritable();
      await writable.write(content);
      await writable.close();

      console.log(`[FS] Wrote Blob: ${path}/${filename}`);
    } catch (e) {
      console.error(`[FS] Error writing blob ${filename}:`, e);
    }
  }

  /**
   * Read file as Blob
   */
  async readBlob(path: string, filename: string): Promise<Blob | null> {
    try {
      const dirHandle = await this.resolvePath(path);
      const fileHandle = await dirHandle.getFileHandle(filename);
      const file = await fileHandle.getFile();
      return file;
    } catch (e: any) {
      if (e.name === "NotFoundError") {
        // File not found is expected for cache misses
        return null;
      }
      console.error(`[FS] Read Blob Error: ${path}/${filename}`, e);
      return null;
    }
  }

  /**
   * Check if a specific path exists
   */
  async exists(fullPath: string): Promise<boolean> {
    try {
      // Split path into dir and filename to check existence
      // This is a simplified check; for robustness we would traverse the whole tree
      if (fullPath === "/") return true;
      await this.resolvePath(fullPath, false);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * List directory contents (ls -la)
   */
  async ls(path: string = "/"): Promise<MacFileEntry[]> {
    await this.init();
    if (!this.root) return [];

    try {
      let dirHandle = this.root;

      if (path !== "/") {
        dirHandle = await this.resolvePath(path);
      }

      const entries: MacFileEntry[] = [];

      // @ts-ignore - TS sometimes misses the async iterator on handles depending on lib version
      for await (const [name, handle] of dirHandle.entries()) {
        let isEmpty = false;
        if (handle.kind === "directory") {
          // Check if empty without iterating all
          // @ts-ignore
          const iterator = handle.entries();
          const first = await iterator.next();
          isEmpty = first.done;
        }

        entries.push({
          name,
          kind: handle.kind,
          isHidden: name.startsWith("."),
          path: `${path === "/" ? "" : path}/${name}`,
          isEmpty,
        });
      }

      // Sort: Directories first, then alphabetical
      return entries.sort((a, b) => {
        if (a.kind === b.kind) return a.name.localeCompare(b.name);
        return a.kind === "directory" ? -1 : 1;
      });
    } catch (e) {
      console.warn(`[FS] Could not list directory: ${path}`);
      return [];
    }
  }
  /**
   * Delete a file or directory
   */
  async delete(path: string, filename: string): Promise<void> {
    try {
      const dirHandle = await this.resolvePath(path);
      await dirHandle.removeEntry(filename, { recursive: true });
      console.log(`[FS] Deleted: ${path}/${filename}`);
    } catch (e) {
      console.error(`[FS] Error deleting ${filename}:`, e);
    }
  }
  /**
   * Rename a file or directory
   */
  async rename(path: string, oldName: string, newName: string): Promise<void> {
    try {
      const dirHandle = await this.resolvePath(path);
      const oldHandle = await dirHandle
        .getDirectoryHandle(oldName)
        .catch(() => dirHandle.getFileHandle(oldName));

      // Try native move if available (Chrome 111+)
      if ((oldHandle as any).move) {
        await (oldHandle as any).move(dirHandle, newName);
        console.log(`[FS] Renamed (native): ${path}/${oldName} -> ${newName}`);
        return;
      }

      // Fallback: Copy and Delete
      if (oldHandle.kind === "file") {
        const file = await (oldHandle as FileSystemFileHandle).getFile();
        const content = await file.arrayBuffer();
        await this.writeBlob(path, newName, content);
        await dirHandle.removeEntry(oldName);
      } else if (oldHandle.kind === "directory") {
        // Recursive copy for directories
        await this.copyDirectory(
          oldHandle as FileSystemDirectoryHandle,
          dirHandle,
          newName
        );
        await dirHandle.removeEntry(oldName, { recursive: true });
      }
      console.log(
        `[FS] Renamed (copy/delete): ${path}/${oldName} -> ${newName}`
      );
    } catch (e) {
      console.error(`[FS] Error renaming ${oldName} to ${newName}:`, e);
      throw e;
    }
  }

  /**
   * Move a file or directory to a new location
   */
  async move(
    sourcePath: string,
    sourceName: string,
    destPath: string,
    destName: string = sourceName
  ): Promise<void> {
    try {
      const sourceDirHandle = await this.resolvePath(sourcePath);
      const destDirHandle = await this.resolvePath(destPath, true);

      let sourceHandle: FileSystemHandle;
      try {
        sourceHandle = await sourceDirHandle.getDirectoryHandle(sourceName);
        console.log(`[FS] Found directory source: ${sourceName}`);
      } catch (e) {
        try {
          sourceHandle = await sourceDirHandle.getFileHandle(sourceName);
          console.log(`[FS] Found file source: ${sourceName}`);
        } catch (e2) {
          throw new Error(`Entry not found: ${sourcePath}/${sourceName}`);
        }
      }

      // Try native move if available (Chrome 111+)
      if ((sourceHandle as any).move) {
        await (sourceHandle as any).move(destDirHandle, destName);
        console.log(
          `[FS] Moved (native): ${sourcePath}/${sourceName} -> ${destPath}/${destName}`
        );
        return;
      }

      // Fallback: Copy and Delete
      if (sourceHandle.kind === "file") {
        const file = await (sourceHandle as FileSystemFileHandle).getFile();
        // Use writeBlob to ensure binary data is preserved
        await this.writeBlob(destPath, destName, await file.arrayBuffer());
        await sourceDirHandle.removeEntry(sourceName);
      } else if (sourceHandle.kind === "directory") {
        // Recursive copy for directories
        await this.copyDirectory(
          sourceHandle as FileSystemDirectoryHandle,
          destDirHandle,
          destName
        );
        await sourceDirHandle.removeEntry(sourceName, { recursive: true });
      }
      console.log(
        `[FS] Moved (copy/delete): ${sourcePath}/${sourceName} -> ${destPath}/${destName}`
      );
    } catch (e) {
      console.error(
        `[FS] Error moving ${sourcePath}/${sourceName} to ${destPath}/${destName}:`,
        e
      );
      throw e;
    }
  }

  private async copyDirectory(
    source: FileSystemDirectoryHandle,
    destParent: FileSystemDirectoryHandle,
    newName: string
  ) {
    const newDir = await destParent.getDirectoryHandle(newName, {
      create: true,
    });
    // @ts-ignore
    for await (const [name, handle] of source.entries()) {
      if (handle.kind === "file") {
        const file = await handle.getFile();
        const content = await file.arrayBuffer();
        const newFile = await newDir.getFileHandle(name, { create: true });
        const writable = await (newFile as any).createWritable();
        await writable.write(content);
        await writable.close();
      } else if (handle.kind === "directory") {
        await this.copyDirectory(handle, newDir, name);
      }
    }
  }
}

export const fs = new MacFileSystem();
