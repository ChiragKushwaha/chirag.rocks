"use client";
import React from "react";
import Image from "next/image";
import { useSystemStore } from "../store/systemStore";
import { fs } from "../lib/FileSystem";
import { useIcon } from "./hooks/useIconManager";
import { generatePDFThumbnail } from "../lib/pdfThumbnail";

interface FileIconProps {
  name: string;
  kind: "file" | "directory";
  isRenaming?: boolean;
  selected?: boolean; // New prop
  onRename?: (newName: string) => void;
  onRenameCancel?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export const FileIcon: React.FC<FileIconProps> = ({
  name,
  kind,
  isRenaming,
  selected,
  onRename,
  onRenameCancel,
  onContextMenu,
  onDoubleClick,
  onClick,
}) => {
  const { selectedFiles = [], user } = useSystemStore();
  // Use prop if provided, otherwise fallback to store (Desktop behavior)
  const isSelected =
    selected !== undefined ? selected : selectedFiles.includes(name);
  const [noteContent, setNoteContent] = React.useState<string>("");
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

  const isNote = name.endsWith(".note");
  const isPdf = name.endsWith(".pdf");

  // Load note content
  React.useEffect(() => {
    if (isNote) {
      const loadContent = async () => {
        const userName = user?.name || "Guest";
        const desktopPath = `/Users/${userName}/Desktop`;
        try {
          if (await fs.exists(`${desktopPath}/${name}`)) {
            const content = await fs.readFile(desktopPath, name);
            setNoteContent(content.substring(0, 500));
          }
        } catch (e) {
          console.error("Failed to load note preview", e);
        }
      };
      loadContent();
    }
  }, [name, isNote, user]);

  // Load PDF for thumbnail
  React.useEffect(() => {
    if (isPdf) {
      const loadPdf = async () => {
        const userName = user?.name || "Guest";
        const desktopPath = `/Users/${userName}/Desktop`;
        try {
          if (await fs.exists(`${desktopPath}/${name}`)) {
            console.log(`[FileIcon] Loading PDF: ${name}`);
            const blob = await fs.readFileBlob(desktopPath, name);
            if (blob) {
              console.log(
                `[FileIcon] Blob loaded for ${name}, size: ${blob.size}`
              );
              const thumbnailUrl = await generatePDFThumbnail(blob);
              console.log(
                `[FileIcon] Thumbnail generated for ${name}: ${
                  thumbnailUrl ? "Success" : "Failed"
                }`
              );
              setPdfUrl(thumbnailUrl);
            } else {
              console.error(`[FileIcon] Failed to read blob for ${name}`);
            }
          }
        } catch (e) {
          console.error("Failed to load PDF preview", e);
        }
      };

      loadPdf();
    }
  }, [name, isPdf, user]);
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

      // Use the remote "folder" icon (cached by useIconManager) for generic folders
      return "folder";
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

    // Heuristic for folders identified as files (e.g. corrupted move)
    if (type === "file" && !name.includes(".")) {
      // If it has no extension, it might be a folder or a binary file.
      // For now, if it contains "folder", treat as folder.
      if (lowerName.includes("folder")) return "folder";
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
      role="button"
      tabIndex={isRenaming ? -1 : 0}
      aria-label={name}
      className={`
        flex flex-col items-center p-1 rounded-[4px]
        ${isNote ? "w-[140px]" : "w-[84px]"}
        ${
          isSelected && !isRenaming
            ? "bg-white/20 ring-1 ring-white/30"
            : isRenaming
            ? ""
            : "hover:bg-white/10 hover:ring-1 hover:ring-white/20"
        }
        transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
      `}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        } else if (!isRenaming) {
          // Simple selection logic
          const event = new CustomEvent("file-selected", { detail: name });
          window.dispatchEvent(event);
        }
      }}
      onKeyDown={(e) => {
        if (isRenaming) return;
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          if (onDoubleClick) onDoubleClick(e as any);
        } else if (e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          e.stopPropagation();
          const event = new CustomEvent("file-selected", { detail: name });
          window.dispatchEvent(event);
        }
      }}
      onContextMenu={onContextMenu}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (!isRenaming && onDoubleClick) {
          onDoubleClick(e);
        }
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className={`mb-1 filter drop-shadow-lg relative transition-transform group-hover:scale-105 ${
          isNote
            ? "w-[128px] h-[128px]"
            : isPdf
            ? "w-[52px] h-[52px]"
            : "w-[64px] h-[64px]"
        }`}
      >
        {isNote ? (
          <div className="w-full h-full bg-[#fef9c3] border border-[#fde047] shadow-sm flex flex-col p-3 relative overflow-hidden rounded-[2px]">
            <div className="text-[10px] leading-snug text-gray-800 font-medium overflow-hidden whitespace-pre-wrap break-words h-full w-full font-serif">
              {noteContent}
            </div>

            {/* Folded Corner Effect */}
            <div
              className="absolute bottom-0 right-0 w-0 h-0 
                border-l-[24px] border-l-transparent
                border-b-[24px] border-b-black/10"
            />
          </div>
        ) : isPdf && pdfUrl ? (
          <div className="w-full h-full relative drop-shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={pdfUrl}
                alt={`${name} preview`}
                width={44}
                height={44}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          </div>
        ) : (
          <Image
            src={iconUrl}
            alt={name}
            width={64}
            height={64}
            className="w-full h-full object-contain drop-shadow-md"
            unoptimized
          />
        )}
      </div>

      {isRenaming ? (
        <input
          autoFocus
          defaultValue={name}
          className="text-[12px] text-center text-black bg-white/90 border border-blue-500 rounded-sm px-1 py-0.5 w-full outline-none shadow-sm"
          onBlur={(e) => {
            console.log("Input blurred, value:", e.target.value);
            onRename?.(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("Enter pressed");
              e.currentTarget.blur(); // Trigger blur to save
            }
            if (e.key === "Escape") {
              console.log("Escape pressed");
              onRenameCancel?.();
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className={`
            text-[12px] font-medium text-white text-center leading-tight px-1.5 py-0.5 rounded-[3px]
            ${
              isSelected
                ? "bg-[#0058D0]"
                : "drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
            }
            line-clamp-2 wrap-break-word w-full
          `}
          style={{
            textShadow: isSelected ? "none" : "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          {name.replace(".note", "")}
        </span>
      )}
    </div>
  );
};
