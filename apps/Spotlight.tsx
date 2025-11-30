import React, { useState, useEffect, useRef } from "react";
import { Search, File, Folder } from "lucide-react";
import { useSystemStore } from "../store/systemStore";
import { useProcessStore } from "../store/processStore";
import { fs } from "../lib/FileSystem";
import { MacFileEntry } from "../lib/types";
import { Finder } from "./Finder/Finder";
import { TextEdit } from "./TextEdit";

interface SearchResult extends MacFileEntry {
  path: string;
}

export const Spotlight: React.FC = () => {
  const { isSpotlightOpen, toggleSpotlight } = useSystemStore();
  const { launchProcess } = useProcessStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSpotlightOpen) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSpotlightOpen]);

  // Recursive Search Logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchFiles = async () => {
      const hits: SearchResult[] = [];
      const queue = ["/"];
      let checks = 0;
      const maxChecks = 500;

      while (queue.length > 0 && checks < maxChecks) {
        const currentPath = queue.shift()!;
        try {
          const entries = await fs.ls(currentPath);
          checks++;

          for (const entry of entries) {
            if (entry.name.toLowerCase().includes(query.toLowerCase())) {
              hits.push({
                ...entry,
                path:
                  currentPath === "/"
                    ? `/${entry.name}`
                    : `${currentPath}/${entry.name}`,
              });
            }
            if (entry.kind === "directory") {
              queue.push(
                currentPath === "/"
                  ? `/${entry.name}`
                  : `${currentPath}/${entry.name}`
              );
            }
          }
        } catch (e) {
          // Ignore access errors
        }
      }
      setResults(hits.slice(0, 8)); // Top 8 matches
      setSelectedIndex(0);
    };

    const timer = setTimeout(searchFiles, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (results[selectedIndex]) handleOpen(results[selectedIndex]);
    } else if (e.key === "Escape") {
      toggleSpotlight(false);
    }
  };

  const handleOpen = (item: SearchResult) => {
    if (!item) return;

    toggleSpotlight(false);

    if (item.kind === "directory") {
      launchProcess("finder", "Finder", "😊", <Finder />);
    } else {
      if (item.name.endsWith(".txt")) {
        const parentDir = item.path.substring(0, item.path.lastIndexOf("/"));
        launchProcess(
          "textedit",
          item.name,
          "📝",
          <TextEdit initialPath={parentDir} initialFilename={item.name} />
        );
      }
    }
  };

  if (!isSpotlightOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-center pt-[25vh] font-sans"
      onClick={() => toggleSpotlight(false)}
    >
      {/* Spotlight Window */}
      <div
        className="
          w-[680px] flex flex-col overflow-hidden
          bg-[#F6F6F6]/80 dark:bg-[#1E1E1E]/80 backdrop-blur-[40px] saturate-150
          rounded-[12px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20 dark:border-white/10
          animate-in fade-in zoom-in-95 duration-150
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Area */}
        <div className="h-[68px] flex items-center px-6 gap-4 border-b border-black/5 dark:border-white/10 shrink-0">
          <Search
            className="w-6 h-6 text-gray-500 dark:text-gray-400 opacity-80"
            strokeWidth={2.5}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Spotlight Search"
            className="
              flex-1 bg-transparent text-[22px] font-light tracking-tight
              text-black dark:text-white placeholder:text-gray-400 
              focus:outline-none caret-[#007AFF]
            "
            autoFocus
          />
        </div>

        {/* Results List */}
        {results.length > 0 && (
          <div className="py-2 bg-white/30 dark:bg-black/10 max-h-[400px] overflow-y-auto">
            {results.map((item, idx) => (
              <div
                key={item.path}
                onClick={() => handleOpen(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`
                  mx-2 px-4 py-2 rounded-[6px] flex items-center gap-3 cursor-default transition-colors duration-75
                  ${
                    idx === selectedIndex
                      ? "bg-[#007AFF] text-white"
                      : "text-gray-900 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/5"
                  }
                `}
              >
                {/* File Icon */}
                <div className="shrink-0">
                  {item.kind === "directory" ? (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Folder
                        className={`w-7 h-7 fill-current ${
                          idx === selectedIndex
                            ? "text-white"
                            : "text-[#007AFF]"
                        }`}
                        strokeWidth={1}
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-8 h-8 rounded shadow-sm border border-black/5 flex items-center justify-center bg-white ${
                        idx === selectedIndex ? "opacity-100" : "opacity-90"
                      }`}
                    >
                      <File
                        className="w-5 h-5 text-gray-500"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </div>

                {/* Text Info */}
                <div className="flex flex-col flex-1 overflow-hidden justify-center h-full">
                  <span className="text-[15px] font-medium leading-tight truncate">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] opacity-80 truncate leading-tight mt-0.5">
                    <span className="font-semibold opacity-70">
                      {item.kind === "directory" ? "Folder" : "Document"}
                    </span>
                    <span className="opacity-50">•</span>
                    <span className="truncate opacity-70">{item.path}</span>
                  </div>
                </div>

                {/* Return Key Hint (Only on selection) */}
                {idx === selectedIndex && (
                  <span className="text-[11px] opacity-70 font-medium tracking-wide pr-1">
                    Open
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State / Hints */}
        {query && results.length === 0 && (
          <div className="px-16 py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No results found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
