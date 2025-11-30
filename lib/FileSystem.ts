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
        entries.push({
          name,
          kind: handle.kind,
          isHidden: name.startsWith("."),
          path: `${path === "/" ? "" : path}/${name}`,
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
}

export const fs = new MacFileSystem();
