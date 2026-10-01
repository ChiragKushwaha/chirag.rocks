import { useState, useEffect, useCallback } from "react";
import { MacFileEntry } from "../../lib/types";
import { fs } from "../../lib/FileSystem";
import { fetchBlob } from "../../lib/apiClient";

export function useDesktopFiles(desktopPath: string) {
  const [files, setFiles] = useState<MacFileEntry[]>([]);

  const refreshFiles = useCallback(async () => {
    try {
      await fs.init();
      const entries = await fs.ls(desktopPath);
      setFiles(entries);
    } catch (error) {
      console.warn("[useDesktopFiles] Failed to load files:", error);
    }
  }, [desktopPath]);

  // Seed Resume.pdf if missing
  const ensureResumeSeeded = useCallback(async () => {
    try {
      await fs.init();
      const exists = await fs.exists(`${desktopPath}/Resume.pdf`);
      if (!exists) {
        const blob = await fetchBlob("/Resume.pdf");
        if (blob.size > 200) {
          await fs.writeBlob(desktopPath, "Resume.pdf", blob);
        }
      }
    } catch (err) {
      console.warn("[useDesktopFiles] Seed Resume check failed:", err);
    }
  }, [desktopPath]);

  useEffect(() => {
    let isMounted = true;

    fs.init()
      .then(() => fs.ls(desktopPath))
      .then((entries) => {
        if (isMounted) setFiles(entries);
      })
      .catch((err) => console.warn("[useDesktopFiles] Init error:", err));

    ensureResumeSeeded();

    const handleFsChange = () => {
      refreshFiles();
    };

    window.addEventListener("file-system-change", handleFsChange);
    return () => {
      isMounted = false;
      window.removeEventListener("file-system-change", handleFsChange);
    };
  }, [desktopPath, ensureResumeSeeded, refreshFiles]);

  return { files, setFiles, refreshFiles };
}
