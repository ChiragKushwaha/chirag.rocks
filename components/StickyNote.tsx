import React, { useState, useRef, useEffect } from "react";
import {
  useStickyNoteStore,
  StickyNote as StickyNoteType,
} from "../store/stickyNoteStore";

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
  const { updateNote, bringToFront } = useStickyNoteStore();
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag if not clicking the textarea (unless we want to allow dragging by text)
    // For now, let's allow dragging by clicking the container padding.
    // If the target is the textarea, we don't drag, to allow text selection.
    if ((e.target as HTMLElement).tagName.toLowerCase() === "textarea") {
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateNote(note.id, {
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset, note.id, updateNote]);

  return (
    <div
      ref={noteRef}
      className={`absolute shadow-lg ${
        colorMap[note.color]
      } p-4 flex flex-col transition-shadow hover:shadow-xl`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        transform: `rotate(${note.rotation}deg)`,
        zIndex: note.zIndex, // Use store zIndex
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseDown={handleMouseDown}
    >
      <textarea
        className="w-full h-full bg-transparent resize-none outline-none border-none font-sans text-gray-800 text-xl leading-snug placeholder-gray-500/50"
        value={note.text}
        onChange={(e) => updateNote(note.id, { text: e.target.value })}
        placeholder="Type a note..."
        style={{ cursor: "text" }}
        onFocus={() => bringToFront(note.id)}
      />
    </div>
  );
};
