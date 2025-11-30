"use client";
import React from "react";
import { useSystemStore } from "../store/systemStore";

import { useIcon } from "./hooks/useIconManager";

interface FileIconProps {
  name: string;
  kind: "file" | "directory";
}

export const FileIcon: React.FC<FileIconProps> = ({ name, kind }) => {
  const { selectedFile, setSelectedFile } = useSystemStore();
  const isSelected = selectedFile === name;

  // Simple icon logic (expand later with real SVGs)
  const getIconName = (name: string, type: string) => {
    const lowerName = name.toLowerCase();

    // System Apps
    if (lowerName.includes("finder")) return "finder";
    if (lowerName.includes("launchpad")) return "launchpad";
    if (lowerName.includes("safari")) return "safari";
    if (lowerName.includes("messages")) return "messages";
    if (lowerName.includes("mail")) return "mail";
    if (lowerName.includes("maps")) return "maps";
    if (lowerName.includes("photos")) return "photos";
    if (lowerName.includes("facetime")) return "facetime";
    if (lowerName.includes("calendar")) return "calendar";
    if (lowerName.includes("contacts")) return "contacts";
    if (lowerName.includes("reminders")) return "reminders";
    if (lowerName.includes("notes")) return "notes";
    if (lowerName.includes("music")) return "music";
    if (lowerName.includes("podcasts")) return "podcasts";
    if (lowerName.includes("tv")) return "tv";
    if (lowerName.includes("app store")) return "appstore";
    if (
      lowerName.includes("settings") ||
      lowerName.includes("system preferences")
    )
      return "settings";
    if (lowerName.includes("terminal")) return "terminal";
    if (lowerName.includes("calculator")) return "calculator";

    // Folders
    if (type === "directory") {
      if (lowerName === "applications") return "folder_applications";
      if (lowerName === "desktop") return "folder_desktop";
      if (lowerName === "documents") return "folder_documents";
      if (lowerName === "downloads") return "folder_downloads";
      if (lowerName === "music") return "folder_music";
      if (lowerName === "pictures") return "folder_pictures";
      if (lowerName === "public") return "folder_public";
      // if (lowerName === "movies") return "folder_movies"; // Not extracted yet

      return "folder"; // Generic folder icon
    }

    // Files based on extension
    if (
      lowerName.endsWith(".png") ||
      lowerName.endsWith(".jpg") ||
      lowerName.endsWith(".jpeg")
    )
      return "preview";
    if (lowerName.endsWith(".mp3") || lowerName.endsWith(".m4a"))
      return "music";
    if (lowerName.endsWith(".mp4") || lowerName.endsWith(".mov"))
      return "quicktime_player";
    if (lowerName.endsWith(".pdf")) return "preview";
    if (lowerName.endsWith(".txt") || lowerName.endsWith(".md"))
      return "textedit";
    if (
      lowerName.endsWith(".json") ||
      lowerName.endsWith(".js") ||
      lowerName.endsWith(".ts") ||
      lowerName.endsWith(".tsx")
    )
      return "vscode";

    // Third Party Apps
    if (lowerName.includes("chrome")) return "chrome";
    if (lowerName.includes("vscode") || lowerName.includes("code"))
      return "vscode";
    if (lowerName.includes("slack")) return "slack";
    if (lowerName.includes("spotify")) return "spotify";

    // Generic App Icon Fallback
    if (
      type === "file" &&
      (lowerName.endsWith(".app") || !name.includes("."))
    ) {
      const cleanName = lowerName
        .replace(".app", "")
        .replace(/[^a-z0-9]/g, "_");
      return cleanName;
    }

    return null;
  };

  const iconName = getIconName(name, kind);
  const iconUrl = useIcon(iconName || "file"); // Fallback to a generic file icon if null, though we handle nulls below

  // Fallback emoji logic if no icon found
  if (!iconName || !iconUrl) {
    return <span className="text-4xl">📄</span>;
  }

  return (
    <div
      className={`
        flex flex-col items-center w-24 p-2 rounded-md 
        ${
          isSelected
            ? "bg-white/20 border border-white/30"
            : "hover:bg-white/10 hover:border hover:border-white/20"
        }
        transition-colors cursor-pointer
      `}
      onClick={(e) => {
        e.stopPropagation();
        // Simple selection logic
        const event = new CustomEvent("file-selected", { detail: name });
        window.dispatchEvent(event);
      }}
      onDoubleClick={() => console.log(`Opening ${name}...`)}
    >
      <div className="text-4xl filter drop-shadow-lg mb-1">
        <img
          src={iconUrl}
          alt={name}
          className="w-full h-full object-contain drop-shadow-md"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
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
