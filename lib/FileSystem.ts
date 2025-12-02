// FileSystem.ts
import { MacFileEntry } from "./types";

export class MacFileSystem {
  private root: FileSystemDirectoryHandle | null = null;
  private memoryCache: Map<string, Blob | string | ArrayBuffer | Uint8Array> =
    new Map();
  private flushQueue: Set<string> = new Set();
  private flushTimeout: NodeJS.Timeout | null = null;
  private FLUSH_DELAY = 2000; // 2 seconds debounce

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

  /**
   * Read file content (Memory First -> OPFS)
   */
  async readFile(path: string, filename: string): Promise<string> {
    const fullPath = `${path === "/" ? "" : path}/${filename}`;

    // 1. Check Memory Cache
    if (this.memoryCache.has(fullPath)) {
      const cached = this.memoryCache.get(fullPath);
      if (typeof cached === "string") return cached;
      if (cached instanceof Blob) return await cached.text();
      if (cached instanceof ArrayBuffer)
        return new TextDecoder().decode(cached);
    }

    // 2. Fallback to OPFS
    try {
      const dirHandle = await this.resolvePath(path);
      const fileHandle = await dirHandle.getFileHandle(filename);
      const file = await fileHandle.getFile();
      const text = await file.text();

      // Hydrate cache
      this.memoryCache.set(fullPath, text);
      return text;
    } catch (e) {
      // console.error(`[FS] Read Error: ${path}/${filename}`, e);
      return "";
    }
  }

  async readFileBlob(path: string, filename: string): Promise<Blob | null> {
    const fullPath = `${path === "/" ? "" : path}/${filename}`;

    // 1. Check Memory Cache
    if (this.memoryCache.has(fullPath)) {
      const cached = this.memoryCache.get(fullPath);
      if (cached instanceof Blob) return cached;
      if (typeof cached === "string") return new Blob([cached]);
      if (cached instanceof ArrayBuffer) return new Blob([cached]);
    }

    // 2. Fallback to OPFS
    try {
      const dirHandle = await this.resolvePath(path);
      const fileHandle = await dirHandle.getFileHandle(filename);
      const file = await fileHandle.getFile();

      // Hydrate cache
      this.memoryCache.set(fullPath, file);
      return file;
    } catch (e) {
      // console.error(`[FS] Read Blob Error: ${path}/${filename}`, e);
      return null;
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
   * Write content to a file (Memory -> Queue -> OPFS)
   */
  async writeFile(
    path: string,
    filename: string,
    content: string | Blob | ArrayBuffer | Uint8Array
  ): Promise<void> {
    const fullPath = `${path === "/" ? "" : path}/${filename}`;

    // 1. Write to Memory
    this.memoryCache.set(fullPath, content);

    // 2. Add to Flush Queue
    this.flushQueue.add(fullPath);

    // 3. Trigger Debounced Flush
    this.scheduleFlush();
  }

  /**
   * Write binary content (Blob/Buffer) to a file.
   */
  async writeBlob(
    path: string,
    filename: string,
    content: Blob | ArrayBuffer
  ): Promise<void> {
    return this.writeFile(path, filename, content);
  }

  /**
   * Schedule a flush operation
   */
  private scheduleFlush() {
    if (this.flushTimeout) clearTimeout(this.flushTimeout);
    this.flushTimeout = setTimeout(() => this.flush(), this.FLUSH_DELAY);
  }

  /**
   * Flush dirty files from memory to OPFS
   */
  private async flush() {
    if (this.flushQueue.size === 0) return;

    console.log(`[FS] Flushing ${this.flushQueue.size} files to OPFS...`);
    const queue = Array.from(this.flushQueue);
    this.flushQueue.clear();

    for (const fullPath of queue) {
      try {
        const content = this.memoryCache.get(fullPath);
        if (!content) continue;

        const lastSlashIndex = fullPath.lastIndexOf("/");
        const path = fullPath.substring(0, lastSlashIndex) || "/";
        const filename = fullPath.substring(lastSlashIndex + 1);

        const dirHandle = await this.resolvePath(path, true);
        const fileHandle = await dirHandle.getFileHandle(filename, {
          create: true,
        });

        const writable = await (fileHandle as any).createWritable();
        await writable.write(content);
        await writable.close();

        console.log(`[FS] Persisted: ${fullPath}`);
      } catch (e) {
        console.error(`[FS] Flush Error for ${fullPath}:`, e);
        // Re-add to queue to retry later? Or just log error
        // this.flushQueue.add(fullPath);
      }
    }
  }

  /**
   * Read file as Blob
   */
  async readBlob(path: string, filename: string): Promise<Blob | null> {
    return this.readFileBlob(path, filename);
  }

  /**
   * Check if a specific path exists
   */
  async exists(fullPath: string): Promise<boolean> {
    // Check memory first
    if (this.memoryCache.has(fullPath)) return true;

    try {
      if (fullPath === "/") return true;

      const cleanPath = fullPath.endsWith("/")
        ? fullPath.slice(0, -1)
        : fullPath;
      const parts = cleanPath.split("/").filter((p) => p.length > 0);

      if (parts.length === 0) return true; // Root

      const filename = parts.pop()!;
      const dirPath = parts.length > 0 ? "/" + parts.join("/") : "/";

      const dirHandle = await this.resolvePath(dirPath, false);

      try {
        await dirHandle.getFileHandle(filename);
        return true;
      } catch {
        try {
          await dirHandle.getDirectoryHandle(filename);
          return true;
        } catch {
          return false;
        }
      }
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
      const onDiskNames = new Set<string>();

      // 1. Get OPFS entries
      // @ts-ignore
      for await (const [name, handle] of dirHandle.entries()) {
        onDiskNames.add(name);

        let isEmpty = false;
        if (handle.kind === "directory") {
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

      // 2. Merge Memory Cache entries (that might not be flushed yet)
      // This is a simplified merge. Ideally we'd parse the memory cache keys to find children of 'path'
      // For now, we rely on the fact that `ls` usually happens after some interaction,
      // and we want to show what's on disk + what's in memory.
      // A full in-memory directory tree structure would be better for `ls` performance and correctness.

      // For this iteration, we'll assume `ls` mostly reads from disk,
      // as `flush` happens relatively quickly (2s).
      // If immediate `ls` consistency is required, we'd need to iterate `this.memoryCache.keys()`

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
    const fullPath = `${path === "/" ? "" : path}/${filename}`;

    // Remove from memory
    this.memoryCache.delete(fullPath);
    this.flushQueue.delete(fullPath);

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
    // Flush first to ensure consistency? Or handle in memory?
    // For simplicity, let's flush first.
    await this.flush();

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
    await this.flush(); // Ensure consistency

    try {
      const sourceDirHandle = await this.resolvePath(sourcePath);
      const destDirHandle = await this.resolvePath(destPath, true);

      let sourceHandle: FileSystemHandle;
      try {
        sourceHandle = await sourceDirHandle.getDirectoryHandle(sourceName);
      } catch (e) {
        try {
          sourceHandle = await sourceDirHandle.getFileHandle(sourceName);
        } catch (e2) {
          throw new Error(`Entry not found: ${sourcePath}/${sourceName}`);
        }
      }

      // Try native move if available (Chrome 111+)
      if ((sourceHandle as any).move) {
        await (sourceHandle as any).move(destDirHandle, destName);
        return;
      }

      // Fallback: Copy and Delete
      if (sourceHandle.kind === "file") {
        const file = await (sourceHandle as FileSystemFileHandle).getFile();
        await this.writeBlob(destPath, destName, await file.arrayBuffer());
        await sourceDirHandle.removeEntry(sourceName);
      } else if (sourceHandle.kind === "directory") {
        await this.copyDirectory(
          sourceHandle as FileSystemDirectoryHandle,
          destDirHandle,
          destName
        );
        await sourceDirHandle.removeEntry(sourceName, { recursive: true });
      }
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
