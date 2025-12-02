import React, { useState, useRef, useEffect } from "react";
import {
  useStickyNoteStore,
  StickyNote as StickyNoteType,
} from "../store/stickyNoteStore";
import { Trash2, ExternalLink, GripHorizontal } from "lucide-react";
import { useProcessStore } from "../store/processStore";
import { Notes } from "../apps/Notes";

interface StickyNoteProps {
  note: StickyNoteType;
}

const colorMap = {
  gray: "bg-[#e8e8e8]",
  yellow: "bg-[#fff57e]",
  pink: "bg-[#ffc0cb]",
  blue: "bg-[#aaccff]",
  green: "bg-[#98fb98]",
};

export const StickyNote: React.FC<StickyNoteProps> = ({ note }) => {
  const { updateNote, removeNote, bringToFront } = useStickyNoteStore();
  const { launchProcess } = useProcessStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag if not clicking the textarea or buttons
    if (
      (e.target as HTMLElement).tagName.toLowerCase() === "textarea" ||
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest(".resize-handle")
    ) {
      return;
    }

    e.stopPropagation();
    bringToFront(note.id);
    setIsDragging(true);
    setOffset({
      x: e.clientX - note.x,
      y: e.clientY - note.y,
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    bringToFront(note.id);
    setIsResizing(true);
  };

  const handleGoToNote = () => {
    // Launch Notes app with this note selected
    launchProcess(
      "notes",
      "Notes",
      "📝",
      <Notes initialNoteId={note.originNoteId} />
    );
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateNote(note.id, {
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        });
      } else if (isResizing) {
        const newWidth = Math.max(150, e.clientX - note.x);
        const newHeight = Math.max(150, e.clientY - note.y);
        updateNote(note.id, {
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, offset, note.id, note.x, note.y, updateNote]);

  return (
    <div
      ref={noteRef}
      className={`absolute shadow-lg ${
        colorMap[note.color]
      } flex flex-col transition-shadow hover:shadow-xl group`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        transform: `rotate(${note.rotation}deg)`,
        zIndex: note.zIndex,
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Bar - Visible on Hover */}
      <div
        className={`h-6 bg-black/10 flex items-center justify-between px-2 transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeNote(note.id);
            }}
            className="p-0.5 hover:bg-black/10 rounded text-gray-600 hover:text-red-500 transition-colors"
            title="Remove Note"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Drag Handle Icon for visual cue */}
        <GripHorizontal size={12} className="text-gray-400" />

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGoToNote();
            }}
            className="p-0.5 hover:bg-black/10 rounded text-gray-600 hover:text-blue-600 transition-colors"
            title="Go to Notes App"
          >
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 p-5 pt-4 relative flex flex-col h-full">
        {/* Title - Visible if exists */}
        {note.title && (
          <div className="font-extrabold text-2xl text-gray-900/90 mb-3 truncate select-none tracking-tight">
            {note.title}
          </div>
        )}

        <textarea
          className="w-full flex-1 bg-transparent resize-none outline-none border-none font-sans text-gray-800 text-lg leading-relaxed placeholder-gray-500/50 p-0"
          value={note.text}
          onChange={(e) => updateNote(note.id, { text: e.target.value })}
          placeholder="Type a note..."
          style={{ cursor: "text" }}
          onFocus={() => bringToFront(note.id)}
        />

        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize resize-handle flex items-end justify-end p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeStart}
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400/50" />
        </div>
      </div>
    </div>
  );
};
