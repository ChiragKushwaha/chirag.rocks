"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MousePointer2,
  Type,
  Square,
  Circle,
  Image as ImageIcon,
  StickyNote,
  ZoomIn,
  ZoomOut,
  Hand,
  Trash2,
  Palette,
  Upload,
} from "lucide-react";
import Image from "next/image";

interface CanvasItem {
  id: number;
  type: "note" | "shape" | "text" | "image";
  content?: string;
  src?: string; // For images
  shape?: "square" | "circle";
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
}

const COLORS = [
  "bg-yellow-200",
  "bg-blue-400",
  "bg-red-400",
  "bg-green-300",
  "bg-purple-300",
  "bg-white",
  "bg-gray-200",
];

export const Freeform: React.FC = () => {
  const [scale, setScale] = useState(100);
  const [tool, setTool] = useState<
    "select" | "hand" | "note" | "shape" | "text" | "image"
  >("select");

  // Mock canvas items
  const [items, setItems] = useState<CanvasItem[]>([
    {
      id: 1,
      type: "note",
      content: "Brainstorming Session",
      x: 100,
      y: 100,
      color: "bg-yellow-200",
      width: 192,
      height: 192,
    },
    {
      id: 2,
      type: "shape",
      shape: "square",
      x: 400,
      y: 150,
      color: "bg-blue-400",
      width: 128,
      height: 128,
    },
    {
      id: 3,
      type: "text",
      content: "Q4 Goals",
      x: 120,
      y: 350,
      color: "text-black dark:text-white",
      width: 200,
      height: 50,
    },
  ]);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragItem, setDragItem] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Mouse position at start
  const [itemStart, setItemStart] = useState({ x: 0, y: 0 }); // Item position at start
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Mouse Down (Canvas)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (tool === "hand" || e.button === 1) {
      setIsPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (tool === "image") {
      // Trigger file upload but coordinate saving needs to wait?
      // Better: Trigger upload, then when file loaded, add at center or mouse.
      // Here we'll just open dialog and use mouse position for 'center' of where we clicked?
      // But file input change event doesn't know mouse layout.
      // Let's store click pos in ref if needed, or just center.
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      return;
    }

    if (tool === "note") {
      addItem("note", e.clientX, e.clientY);
    } else if (tool === "shape") {
      addItem("shape", e.clientX, e.clientY);
    } else if (tool === "text") {
      addItem("text", e.clientX, e.clientY);
    } else if (tool === "select") {
      if (editingItemId === null) {
        setSelectedItemId(null);
      }
    }
  };

  const addItem = (
    type: CanvasItem["type"],
    clientX: number,
    clientY: number,
    extraData?: Partial<CanvasItem>
  ) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - pan.x) / (scale / 100);
    const y = (clientY - rect.top - pan.y) / (scale / 100);

    const newItem: CanvasItem = {
      id: Date.now(),
      type,
      x: x - 50, // Center roughly
      y: y - 50,
      color:
        type === "note"
          ? "bg-yellow-200"
          : type === "shape"
          ? "bg-red-400"
          : "text-black dark:text-white",
      content:
        type === "note"
          ? "New Note"
          : type === "text"
          ? "Type here"
          : undefined,
      shape: "square",
      width: type === "note" ? 192 : type === "image" ? 200 : 100,
      height: type === "note" ? 192 : type === "image" ? 200 : 50,
      ...extraData,
    };

    setItems((prev) => [...prev, newItem]);
    setTool("select"); // Switch back to select
    setSelectedItemId(newItem.id);

    if (type === "note" || type === "text") {
      setEditingItemId(newItem.id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          // Add image at center of screen?
          // Or just some default coord.
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.width / 2 + rect.left;
          const centerY = rect.height / 2 + rect.top;

          addItem("image", centerX, centerY, {
            src: ev.target.result as string,
            color: "transparent",
          });
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleItemMouseDown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (tool !== "select") return;

    setSelectedItemId(id);

    if (editingItemId === id) return;

    setDragItem(id);
    setDragStart({ x: e.clientX, y: e.clientY });

    const item = items.find((i) => i.id === id);
    if (item) {
      setItemStart({ x: item.x, y: item.y });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const item = items.find((i) => i.id === id);
    if (item && (item.type === "note" || item.type === "text")) {
      setEditingItemId(id);
      setDragItem(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (dragItem !== null) {
      const dx = (e.clientX - dragStart.x) / (scale / 100);
      const dy = (e.clientY - dragStart.y) / (scale / 100);

      setItems((prev) =>
        prev.map((item) =>
          item.id === dragItem
            ? { ...item, x: itemStart.x + dx, y: itemStart.y + dy }
            : item
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDragItem(null);
  };

  const handleContentChange = (id: number, content: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, content } : item))
    );
  };

  const handleBlur = () => {
    setEditingItemId(null);
  };

  const handleColorChange = (color: string) => {
    if (selectedItemId !== null) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItemId ? { ...item, color } : item
        )
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingItemId !== null) return;

      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        selectedItemId !== null
      ) {
        setItems((prev) => prev.filter((i) => i.id !== selectedItemId));
        setSelectedItemId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemId, editingItemId]);

  return (
    <div
      className="flex flex-col h-full bg-[#f5f5f7] dark:bg-[#1e1e1e] relative overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-lg border border-gray-200 dark:border-black/10 p-1 flex gap-1 z-20">
        {[
          { id: "select", icon: MousePointer2 },
          { id: "hand", icon: Hand },
          { id: "note", icon: StickyNote },
          { id: "shape", icon: Square },
          { id: "text", icon: Type },
          { id: "image", icon: ImageIcon },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id as any)}
            className={`p-2 rounded-md transition-colors ${
              tool === t.id
                ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400"
            }`}
            title={t.id}
          >
            <t.icon size={20} />
          </button>
        ))}
      </div>

      {/* Contextual Toolbar (Color Picker) */}
      {selectedItemId !== null && !editingItemId && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-lg border border-gray-200 dark:border-black/10 p-2 flex gap-2 z-20 animate-in fade-in slide-in-from-top-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border border-black/10 ${color} hover:scale-110 transition-transform`}
              onClick={(e) => {
                e.stopPropagation();
                handleColorChange(color);
              }}
            />
          ))}
          <div className="w-[1px] bg-gray-200 dark:bg-white/10 mx-1" />
          <button
            className="text-red-500 hover:bg-red-500/10 p-1 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setItems(items.filter((i) => i.id !== selectedItemId));
              setSelectedItemId(null);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-lg border border-gray-200 dark:border-black/10 p-1 flex items-center gap-2 z-20">
        <button
          onClick={() => setScale(Math.max(10, scale - 10))}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs font-medium w-12 text-center text-black dark:text-white">
          {scale}%
        </span>
        <button
          onClick={() => setScale(Math.min(400, scale + 10))}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Canvas Area */}
      <div
        className={`flex-1 relative overflow-hidden ${
          tool === "hand" || isPanning
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-default"
        }`}
        onMouseDown={handleCanvasMouseDown}
        ref={containerRef}
      >
        {/* Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            color: "var(--foreground)",
          }}
        />

        {/* Transform Container */}
        <div
          className="absolute inset-0 origin-top-left transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${
              scale / 100
            })`,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`absolute group cursor-move transition-shadow ${
                selectedItemId === item.id
                  ? "ring-2 ring-blue-500 z-10"
                  : "hover:ring-1 ring-blue-300"
              }`}
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
              }}
              onMouseDown={(e) => handleItemMouseDown(e, item.id)}
              onDoubleClick={(e) => handleDoubleClick(e, item.id)}
            >
              {item.type === "note" && (
                <div
                  className={`w-full h-full ${item.color} p-4 shadow-md flex items-center justify-center text-center font-handwriting text-lg text-black`}
                >
                  {editingItemId === item.id ? (
                    <textarea
                      className="w-full h-full bg-transparent resize-none outline-none text-center"
                      value={item.content}
                      onChange={(e) =>
                        handleContentChange(item.id, e.target.value)
                      }
                      onBlur={handleBlur}
                      autoFocus
                    />
                  ) : (
                    item.content
                  )}
                </div>
              )}
              {item.type === "shape" && (
                <div
                  className={`w-full h-full ${item.color} rounded-lg shadow-md`}
                />
              )}
              {item.type === "text" && (
                <div
                  className={`text-4xl font-bold ${item.color} whitespace-nowrap min-w-[50px]`}
                >
                  {editingItemId === item.id ? (
                    <input
                      className="bg-transparent outline-none w-full"
                      value={item.content}
                      onChange={(e) =>
                        handleContentChange(item.id, e.target.value)
                      }
                      onBlur={handleBlur}
                      autoFocus
                    />
                  ) : (
                    item.content
                  )}
                </div>
              )}
              {item.type === "image" && item.src && (
                <div className="w-full h-full relative">
                  <Image
                    src={item.src}
                    alt="Upload"
                    fill
                    className="object-contain pointer-events-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
