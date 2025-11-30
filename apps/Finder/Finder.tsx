import React, { useEffect, useState } from "react";
import { fs } from "../../lib/FileSystem";
import { Sidebar } from "./Sidebar";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  Folder,
  Search,
} from "lucide-react";
import { MacFileEntry } from "../../lib/types";
import { MacOSButton, MacOSInput } from "../../components/ui/MacOSDesignSystem"; // Import new UI

interface FinderProps {
  initialPath?: string;
}

export const Finder: React.FC<FinderProps> = ({
  initialPath = "/Users/Guest",
}) => {
  // Navigation State
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Data State
  const [files, setFiles] = useState<MacFileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // 1. Fetch Files from OPFS
  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      const entries = await fs.ls(currentPath);
      setFiles(entries);
      setLoading(false);
    };
    loadFiles();
  }, [currentPath]);

  // 2. Navigation Handlers
  const handleNavigate = (path: string) => {
    if (path === currentPath) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setSelectedItem(null);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const handleDoubleClick = (entry: MacFileEntry) => {
    if (entry.kind === "directory") {
      handleNavigate(entry.path);
    } else {
      console.log(`Open file: ${entry.name}`);
    }
  };

  return (
    <div className="flex flex-col h-full w-full text-gray-800 font-sans">
      {/* TOOLBAR */}
      <div className="h-[52px] bg-[#F6F6F6] dark:bg-[#282828] border-b border-[#D1D1D6] dark:border-black/50 flex items-center px-4 justify-between flex-shrink-0 window-drag-handle">
        <div className="flex items-center gap-4">
          {/* Navigation Arrows - Using simple buttons for icon-only */}
          <div className="flex items-center gap-0">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors text-gray-600 dark:text-gray-300"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex === history.length - 1}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors text-gray-600 dark:text-gray-300"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Current Folder Title */}
          <div className="font-semibold text-[13px] flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Folder size={16} className="text-[#007AFF] fill-[#007AFF]/10" />
            {currentPath.split("/").pop() || "Macintosh HD"}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="flex bg-black/5 dark:bg-white/10 p-0.5 rounded-[6px]">
            <button className="p-1 rounded-[4px] hover:bg-white dark:hover:bg-gray-600 shadow-sm transition-all text-gray-700 dark:text-gray-200">
              <LayoutGrid size={14} />
            </button>
            <button className="p-1 rounded-[4px] hover:bg-white dark:hover:bg-gray-600 transition-all text-gray-500 dark:text-gray-400">
              <ListIcon size={14} />
            </button>
          </div>

          <div className="w-48">
            <MacOSInput placeholder="Search" icon={<Search size={12} />} />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />

        {/* FILE GRID */}
        <div
          className="flex-1 bg-white dark:bg-[#1E1E1E] overflow-y-auto p-4"
          onClick={() => setSelectedItem(null)}
        >
          {loading ? (
            <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
              Loading...
            </div>
          ) : files.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 text-sm">
              <span className="text-4xl mb-2 opacity-20">📂</span>
              <span>Folder is empty</span>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 auto-rows-min">
              {files.map(
                (file) =>
                  !file.isHidden && (
                    <div
                      key={file.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(file.name);
                      }}
                      onDoubleClick={() => handleDoubleClick(file)}
                      className={`
                      flex flex-col items-center justify-start p-2 rounded-[6px] cursor-default group
                      ${
                        selectedItem === file.name
                          ? "bg-[#0058D0]/10 dark:bg-[#0058D0]/30"
                          : "hover:bg-gray-100 dark:hover:bg-white/5"
                      }
                    `}
                    >
                      <div className="w-16 h-16 mb-1 flex items-center justify-center text-5xl filter drop-shadow-sm transition-transform">
                        {file.kind === "directory" ? "📁" : "📄"}
                      </div>
                      <span
                        className={`
                        text-[12px] text-center leading-tight px-1.5 py-0.5 rounded-[4px]
                        ${
                          selectedItem === file.name
                            ? "bg-[#0058D0] text-white font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }
                      `}
                        style={{ wordBreak: "break-word" }}
                      >
                        {file.name}
                      </span>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>

      {/* STATUS BAR */}
      <div className="h-6 bg-[#F6F6F6] dark:bg-[#282828] border-t border-[#D1D1D6] dark:border-black/50 flex items-center px-4 text-[11px] text-gray-500 dark:text-gray-400 select-none justify-between">
        <span>{files.length} items</span>
        <span>499 GB available</span>
      </div>
    </div>
  );
};
