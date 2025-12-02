import React, { useState } from "react";
import {
  Smile,
  Camera,
  Image as ImageIcon,
  Type,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

interface AvatarEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avatar: string) => void;
  currentAvatar?: string;
}

const CATEGORIES = [
  { id: "memoji", label: "Memoji", icon: Smile },
  { id: "emoji", label: "Emoji", icon: Smile },
  { id: "monogram", label: "Monogram", icon: Type },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "photos", label: "Photos", icon: ImageIcon },
  { id: "suggestions", label: "Suggestions", icon: MoreHorizontal },
];

const MEMOJI_mock = [
  "🐭",
  "🐙",
  "🐮",
  "🦒",
  "🦈",
  "🦉",
  "🐗",
  "🐵",
  "🤖",
  "🐱",
  "🐶",
  "👽",
  "🦊",
  "💩",
  "🐷",
  "🐼",
  "🐰",
  "🐔",
  "🦄",
  "🦁",
  "🐲",
  "💀",
  "🐻",
  "🐯",
  "🐨",
  "🦖",
  "👻",
];

export const AvatarEditor: React.FC<AvatarEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  currentAvatar,
}) => {
  const [activeCategory, setActiveCategory] = useState("memoji");
  const [selectedItem, setSelectedItem] = useState(currentAvatar || "🦅");
  const [zoom, setZoom] = useState(50);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-[800px] h-[600px] bg-[#1e1e1e] rounded-xl shadow-2xl border border-white/10 flex overflow-hidden text-gray-100 font-sans">
        {/* Sidebar */}
        <div className="w-[200px] bg-[#2b2b2b]/50 border-r border-white/10 flex flex-col pt-4">
          <div className="px-4 mb-4">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-white/10 border border-transparent rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-0.5 px-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <cat.icon size={16} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          {/* Header Tabs */}
          <div className="h-12 border-b border-white/10 flex items-center justify-center gap-1 px-4">
            {["Memoji", "Pose", "Style"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
                  tab === "Memoji"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-5 gap-4">
              {/* Add Button */}
              <button className="aspect-square rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Plus size={32} className="text-gray-400" />
              </button>

              {/* Memoji Items */}
              {MEMOJI_mock.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedItem(emoji)}
                  className={`aspect-square rounded-full flex items-center justify-center text-4xl hover:bg-white/5 transition-all ${
                    selectedItem === emoji
                      ? "bg-white/10 ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Preview & Actions */}
          <div className="h-[200px] border-t border-white/10 flex">
            {/* Preview Circle */}
            <div className="w-[200px] flex flex-col items-center justify-center border-r border-white/10 p-4 relative">
              <div className="w-32 h-32 rounded-full bg-black overflow-hidden flex items-center justify-center text-8xl relative">
                {/* Simulate Zoom */}
                <div
                  style={{ transform: `scale(${0.5 + zoom / 100})` }}
                  className="transition-transform"
                >
                  {selectedItem}
                </div>
              </div>

              {/* Zoom Slider */}
              <div className="absolute bottom-4 w-32 flex items-center gap-2">
                <span className="text-[10px] text-gray-500">−</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
                <span className="text-[10px] text-gray-500">+</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex-1 flex items-end justify-end p-6 gap-3 bg-[#1e1e1e]">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(selectedItem)}
                className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
