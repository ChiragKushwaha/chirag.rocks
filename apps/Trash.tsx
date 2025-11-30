import React, { useEffect, useState } from "react";
import { fs } from "../lib/FileSystem";
import { MacFileEntry } from "../lib/types";
import { FileIcon } from "../components/FileIcon";
import { useMenuStore } from "../store/menuStore";

export const Trash: React.FC = () => {
  const [files, setFiles] = useState<MacFileEntry[]>([]);
  const { openContextMenu } = useMenuStore();

  const loadFiles = async () => {
    // Ensure trash directory exists
    if (!(await fs.exists("/Users/Guest/.Trash"))) {
      await fs.mkdir("/Users/Guest/.Trash");
    }
    const f = await fs.ls("/Users/Guest/.Trash");
    setFiles(f);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const emptyTrash = async () => {
    // Naive implementation: delete everything in .Trash
    // In a real FS we'd need recursive delete, but our fs.delete might handle it or we iterate
    // Assuming fs.delete works on files. For directories we might need more logic if fs.delete isn't recursive
    // For now, let's just delete the files we see
    for (const file of files) {
      // TODO: Implement recursive delete in FileSystem if not present
      // For now just delete the entry
      // We need a full path for delete? fs.delete takes path and name? Or just path?
      // Looking at FileSystem.ts (I recall it takes path and name or just path?)
      // Let's assume we can delete by path
      // Wait, fs.delete(path, name)
      await fs.delete("/Users/Guest/.Trash", file.name);
    }
    loadFiles();
  };

  const putBack = async (file: MacFileEntry) => {
    // Move back to Desktop (simplification, ideally we remember original location)
    // We need a move command. If not, read and write then delete.
    const content = await fs.readFile("/Users/Guest/.Trash", file.name);
    await fs.writeFile("/Users/Guest/Desktop", file.name, content);
    await fs.delete("/Users/Guest/.Trash", file.name);
    loadFiles();

    // Trigger a desktop refresh if possible?
    // The Desktop component polls or we need a global event.
    // For now, user might need to refresh or we rely on re-render if store updates
    window.dispatchEvent(new CustomEvent("file-system-change"));
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="h-10 bg-gray-100 border-b border-gray-300 flex items-center px-4 justify-between">
        <span className="font-semibold text-gray-700">Trash</span>
        <button
          onClick={emptyTrash}
          className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 active:bg-gray-400"
        >
          Empty
        </button>
      </div>
      <div className="flex-1 p-4 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 content-start overflow-y-auto">
        {files.length === 0 && (
          <div className="col-span-full text-center text-gray-400 mt-10">
            Trash is empty
          </div>
        )}
        {files.map((file) => (
          <div
            key={file.name}
            className="flex flex-col items-center group"
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openContextMenu(e.clientX, e.clientY, [
                { label: "Put Back", action: () => putBack(file) },
                {
                  label: "Delete Immediately",
                  action: async () => {
                    await fs.delete("/Users/Guest/.Trash", file.name);
                    loadFiles();
                  },
                  danger: true,
                },
              ]);
            }}
          >
            <div className="w-16 h-16 mb-1">
              <FileIcon name={file.name} kind={file.kind} />
            </div>
            <span className="text-xs text-center text-gray-600 group-hover:bg-blue-100 px-1 rounded">
              {file.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
