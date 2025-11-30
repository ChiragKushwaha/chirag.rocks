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
  const getIconPath = (name: string, type: string) => {
    const lowerName = name.toLowerCase();

    // System Apps
    if (lowerName.includes("finder")) return "/icons/finder.png";
    if (lowerName.includes("launchpad")) return "/icons/launchpad.png";
    if (lowerName.includes("safari")) return "/icons/safari.png";
    if (lowerName.includes("messages")) return "/icons/messages.png";
    if (lowerName.includes("mail")) return "/icons/mail.png";
    if (lowerName.includes("maps")) return "/icons/maps.png";
    if (lowerName.includes("photos")) return "/icons/photos.png";
    if (lowerName.includes("facetime")) return "/icons/facetime.png";
    if (lowerName.includes("calendar")) return "/icons/calendar.png";
    if (lowerName.includes("contacts")) return "/icons/contacts.png";
    if (lowerName.includes("reminders")) return "/icons/reminders.png";
    if (lowerName.includes("notes")) return "/icons/notes.png";
    if (lowerName.includes("music")) return "/icons/music.png";
    if (lowerName.includes("podcasts")) return "/icons/podcasts.png";
    if (lowerName.includes("tv")) return "/icons/tv.png";
    if (lowerName.includes("app store")) return "/icons/appstore.png";
    if (
      lowerName.includes("settings") ||
      lowerName.includes("system preferences")
    )
      return "/icons/settings.png";
    if (lowerName.includes("terminal")) return "/icons/terminal.png";
    if (lowerName.includes("calculator")) return "/icons/calculator.png";

    // Third Party Apps
    if (lowerName.includes("chrome")) return "/icons/chrome.png";
    if (lowerName.includes("vscode") || lowerName.includes("code"))
      return "/icons/vscode.png";
    if (lowerName.includes("slack")) return "/icons/slack.png";
    if (lowerName.includes("spotify")) return "/icons/spotify.png";

    // Generic App Icon Fallback
    // If it looks like an app name, try to find a matching icon
    // e.g. "Activity Monitor" -> "activity_monitor.png"
    if (type === "app" || lowerName.endsWith(".app")) {
      const cleanName = lowerName
        .replace(".app", "")
        .replace(/[^a-z0-9]/g, "_");
      return `/icons/${cleanName}.png`;
    }

    // Fallback for generic types
    if (type === "folder") return "/icons/finder.png"; // Use finder icon for folders for now or a generic folder icon if available

    return null;
  };

  const iconPath = getIconPath(name, kind || "file");

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
        {iconPath ? (
          <img
            src={iconPath}
            alt={name}
            className="w-full h-full object-contain drop-shadow-md"
            onError={(e) => {
              // Fallback to Lucide icon if image fails
              e.currentTarget.style.display = "none";
              // Assuming a fallback element exists or can be rendered
              // For now, if image fails, nothing will show in its place unless explicitly handled
            }}
          />
        ) : // Original emoji fallback if no specific iconPath is found
        kind === "directory" ? (
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
