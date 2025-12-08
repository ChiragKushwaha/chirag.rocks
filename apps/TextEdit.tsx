import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { fs } from "../lib/FileSystem";

interface TextEditProps {
  initialPath?: string; // e.g., '/Users/Guest/Documents'
  initialFilename?: string; // e.g., 'Notes.txt'
}

import { useSystemStore } from "../store/systemStore";

export const TextEdit: React.FC<TextEditProps> = ({
  initialPath,
  initialFilename,
}) => {
  const t = useTranslations("TextEdit");
  const { user } = useSystemStore();
  const userName = user?.name || t("Guest");
  const defaultPath = `/Users/${userName}/Documents`;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Save State
  const [filename, setFilename] = useState(initialFilename || t("Untitled"));
  const [path] = useState(initialPath || defaultPath);

  useEffect(() => {
    if (initialPath && initialFilename) {
      const load = async () => {
        setLoading(true);
        const data = await fs.readFile(initialPath, initialFilename);
        setContent(data);
        setLoading(false);
      };
      load();
    }
  }, [initialPath, initialFilename]);

  const handleSave = async () => {
    await fs.writeFile(path, filename, content);
    alert(t("SavedAlert", { path, filename })); // Replace with proper OS notification later
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-gray-900 font-mono text-sm">
      {/* Toolbar (Simplified) */}
      <div className="h-8 bg-gray-100 border-b border-gray-300 flex items-center px-2 gap-2 shrink-0">
        <input
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="bg-transparent border border-transparent hover:border-gray-300 rounded px-1 text-xs font-semibold w-32 focus:outline-none focus:bg-white focus:border-blue-500"
        />
        <div className="flex-1" />
        <button
          onClick={handleSave}
          className="text-xs bg-white border border-gray-300 px-2 py-0.5 rounded shadow-sm active:bg-gray-100"
        >
          {t("Save")}
        </button>
      </div>

      {/* Editor Area */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          {t("Loading")}
        </div>
      ) : (
        <textarea
          className="flex-1 w-full h-full p-4 resize-none focus:outline-none leading-relaxed"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("Placeholder")}
          spellCheck={false}
        />
      )}
    </div>
  );
};
