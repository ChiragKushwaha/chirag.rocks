import React from "react";
import dynamic from "next/dynamic";
import { MacFileEntry } from "../../lib/types";

const Notes = dynamic(() => import("../../apps/Notes").then((m) => m.Notes));
const TextEdit = dynamic(() => import("../../apps/TextEdit").then((m) => m.TextEdit));
const Photos = dynamic(() => import("../../apps/Photos").then((m) => m.Photos));
const MediaPlayer = dynamic(() => import("../../apps/MediaPlayer").then((m) => m.MediaPlayer));
const PDFViewer = dynamic(() => import("../../apps/PDFViewer").then((m) => m.PDFViewer));
const V86 = dynamic(() => import("../../apps/V86").then((m) => m.V86));

export function getAppForFile(file: MacFileEntry, desktopPath: string) {
  const ext = file.name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return {
        id: "preview",
        name: "Preview",
        icon: "📄",
        component: <PDFViewer initialPath={desktopPath} initialFilename={file.name} />,
        windowConfig: { width: 1000, height: 720, x: 100, y: 50 },
      };
    case "note":
      return {
        id: "notes",
        name: "Notes",
        icon: "notes",
        component: <Notes initialPath={desktopPath} initialFilename={file.name} />,
      };
    case "txt":
    case "md":
    case "js":
    case "ts":
    case "tsx":
    case "json":
      return {
        id: "textedit",
        name: "TextEdit",
        icon: "📝",
        component: <TextEdit initialPath={desktopPath} initialFilename={file.name} />,
      };
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
    case "heic":
      return {
        id: "photos",
        name: "Photos",
        icon: "photos",
        component: <Photos initialPath={desktopPath} initialFilename={file.name} />,
      };
    case "mp4":
    case "mp3":
    case "mov":
      return {
        id: "player",
        name: "Media Player",
        icon: "▶️",
        component: <MediaPlayer initialPath={desktopPath} initialFilename={file.name} />,
      };
    case "iso":
    case "img":
      return {
        id: "v86",
        name: "Virtual Machine",
        icon: "disk_image",
        component: <V86 initialPath={desktopPath} initialFilename={file.name} />,
        windowConfig: { width: 1024, height: 600, x: 100, y: 100, resizable: false },
      };
    default:
      return {
        id: "textedit",
        name: "TextEdit",
        icon: "📝",
        component: <TextEdit initialPath={desktopPath} initialFilename={file.name} />,
      };
  }
}
