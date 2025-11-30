// types.ts

export type FileSystemEntryKind = "file" | "directory";

export interface MacFileEntry {
  name: string;
  kind: FileSystemEntryKind;
  isHidden: boolean;
  path: string;
  isEmpty?: boolean;
}

export interface SymlinkConfig {
  path: string;
  target: string;
}
