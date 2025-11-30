"use client";
import React from "react";
import { useSystemStore } from "../store/systemStore";

interface FileIconProps {
  name: string;
  kind: "file" | "directory";
}

export const FileIcon: React.FC<FileIconProps> = ({ name, kind }) => {
  const { selectedFile, setSelectedFile } = useSystemStore();
  const isSelected = selectedFile === name;

  // Simple icon logic (expand later with real SVGs)
  const iconSrc =
    kind === "directory" ? "📁" : name.endsWith(".txt") ? "📄" : "unknown";

  return (
    <div
      className={`
        flex flex-col items-center justify-center w-24 p-2 rounded-md cursor-default
        ${
          isSelected
            ? "bg-white/20 border border-white/30 backdrop-blur-sm"
            : "hover:bg-white/10"
        }
      `}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedFile(name);
      }}
      onDoubleClick={() => console.log(`Opening ${name}...`)}
    >
      <div className="text-4xl filter drop-shadow-lg mb-1">
        {kind === "directory" ? (
          // Use a folder emoji or SVG here
          <span className="text-blue-400">📁</span>
        ) : (
          <span className="text-gray-200">📄</span>
        )}
      </div>
      <span
        className={`
        text-xs font-medium text-white text-center leading-tight px-1 py-0.5 rounded
        ${isSelected ? "bg-blue-600" : "drop-shadow-md"}
      `}
      >
        {name}
      </span>
    </div>
  );
};
