import { fs } from "./FileSystem";

const TRASH_METADATA_FILE = ".trash-info.json";

interface TrashMetadata {
  [filename: string]: string; // filename -> originalPath
}

export const TrashUtils = {
  async getMetadata(trashPath: string): Promise<TrashMetadata> {
    try {
      if (await fs.exists(`${trashPath}/${TRASH_METADATA_FILE}`)) {
        const content = await fs.readFile(trashPath, TRASH_METADATA_FILE);
        return JSON.parse(content);
      }
    } catch (e) {
      console.error("Failed to read trash metadata", e);
    }
    return {};
  },

  async saveMetadata(
    trashPath: string,
    metadata: TrashMetadata
  ): Promise<void> {
    try {
      await fs.writeFile(
        trashPath,
        TRASH_METADATA_FILE,
        JSON.stringify(metadata, null, 2)
      );
    } catch (e) {
      console.error("Failed to save trash metadata", e);
    }
  },

  async addToMetadata(
    trashPath: string,
    filename: string,
    originalPath: string
  ): Promise<void> {
    const metadata = await this.getMetadata(trashPath);
    metadata[filename] = originalPath;
    await this.saveMetadata(trashPath, metadata);
  },

  async removeFromMetadata(trashPath: string, filename: string): Promise<void> {
    const metadata = await this.getMetadata(trashPath);
    if (metadata[filename]) {
      delete metadata[filename];
      await this.saveMetadata(trashPath, metadata);
    }
  },

  async getOriginalPath(
    trashPath: string,
    filename: string
  ): Promise<string | null> {
    const metadata = await this.getMetadata(trashPath);
    return metadata[filename] || null;
  },
};
