import React, { useState, useRef } from "react";
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
} from "lucide-react";

export const Freeform: React.FC = () => {
  const [scale, setScale] = useState(100);
  const [tool, setTool] = useState("select");

  // Mock canvas items
  const [items] = useState([
    {
      id: 1,
      type: "note",
      content: "Brainstorming Session",
      x: 100,
      y: 100,
      color: "bg-yellow-200",
    },
    {
      id: 2,
      type: "shape",
      shape: "square",
      x: 400,
      y: 150,
      color: "bg-blue-400",
    },
    {
      id: 3,
      type: "text",
      content: "Q4 Goals",
      x: 120,
      y: 300,
      color: "text-black",
    },
    {
      id: 4,
      type: "note",
      content: "Launch MVP",
      x: 350,
      y: 350,
      color: "bg-green-200",
    },
  ]);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] dark:bg-[#1e1e1e] relative overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-lg border border-gray-200 dark:border-black/10 p-1 flex gap-1 z-10">
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
            onClick={() => setTool(t.id)}
            className={`p-2 rounded-md transition-colors ${
              tool === t.id
                ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400"
            }`}
          >
            <t.icon size={20} />
          </button>
        ))}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-lg border border-gray-200 dark:border-black/10 p-1 flex items-center gap-2 z-10">
        <button
          onClick={() => setScale(Math.max(10, scale - 10))}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs font-medium w-12 text-center">{scale}%</span>
        <button
          onClick={() => setScale(Math.min(400, scale + 10))}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-auto cursor-crosshair bg-[#f5f5f7] dark:bg-[#1e1e1e]">
        {/* Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Canvas Content */}
        <div
          className="absolute inset-0"
          style={{ transform: `scale(${scale / 100})`, transformOrigin: "0 0" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute shadow-sm cursor-move hover:ring-2 ring-blue-500 transition-shadow"
              style={{ left: item.x, top: item.y }}
            >
              {item.type === "note" && (
                <div
                  className={`w-48 h-48 ${item.color} p-4 shadow-md flex items-center justify-center text-center font-handwriting text-lg`}
                >
                  {item.content}
                </div>
              )}
              {item.type === "shape" && (
                <div
                  className={`w-32 h-32 ${item.color} rounded-lg shadow-md`}
                />
              )}
              {item.type === "text" && (
                <div
                  className={`text-4xl font-bold ${item.color} whitespace-nowrap`}
                >
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
