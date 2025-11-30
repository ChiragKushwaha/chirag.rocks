import React, { useState } from "react";
import { MacOSSidebar } from "../components/ui/MacOSSidebar";

import {
  Image as ImageIcon,
  Heart,
  Clock,
  Users,
  Map,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  Maximize2,
} from "lucide-react";

const PHOTOS_DATA = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  color: [
    "bg-red-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-yellow-400",
    "bg-lime-400",
    "bg-green-400",
    "bg-emerald-400",
    "bg-teal-400",
    "bg-cyan-400",
    "bg-sky-400",
    "bg-blue-400",
    "bg-indigo-400",
    "bg-violet-400",
    "bg-purple-400",
    "bg-fuchsia-400",
    "bg-pink-400",
    "bg-rose-400",
  ][i % 17],
  aspect: ["aspect-square", "aspect-[4/3]", "aspect-[3/4]", "aspect-[16/9]"][
    i % 4
  ],
  date: "Today",
  location: "San Francisco",
}));

export const Photos: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState("library");
  const [zoomLevel, setZoomLevel] = useState(3); // 1-5 columns

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#1e1e1e] text-black dark:text-white">
      {/* Sidebar */}
      <MacOSSidebar
        className="w-64 pt-10"
        activeItemId={selectedItem}
        onItemClick={setSelectedItem}
        sections={[
          {
            title: "Library",
            items: [
              {
                id: "library",
                label: "Library",
                icon: <ImageIcon size={16} />,
              },
              {
                id: "favorites",
                label: "Favorites",
                icon: <Heart size={16} />,
              },
              { id: "recents", label: "Recents", icon: <Clock size={16} /> },
              { id: "people", label: "People", icon: <Users size={16} /> },
              { id: "places", label: "Places", icon: <Map size={16} /> },
              {
                id: "deleted",
                label: "Recently Deleted",
                icon: <Trash2 size={16} />,
              },
            ],
          },
          {
            title: "Albums",
            items: [
              {
                id: "album1",
                label: "Vacation 2024",
                icon: <LayoutGrid size={16} />,
              },
              {
                id: "album2",
                label: "Design Assets",
                icon: <LayoutGrid size={16} />,
              },
            ],
          },
        ]}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-[#1e1e1e]">
        {/* Toolbar */}
        <div className="h-12 border-b border-[var(--separator)] flex items-center justify-between px-4 bg-[var(--titlebar-bg)]/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <ChevronLeft size={18} className="text-gray-500" />
            </button>
            <button className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <ChevronRight size={18} className="text-gray-500" />
            </button>
            <span className="ml-4 font-semibold text-sm">
              {selectedItem === "library" ? "Library" : selectedItem}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-md px-2 py-1">
              <ZoomOut size={14} className="text-gray-500" />
              <input
                type="range"
                min="1"
                max="5"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                className="w-24 accent-blue-500 h-1"
              />
              <ZoomIn size={14} className="text-gray-500" />
            </div>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1.5 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-1 text-xs bg-gray-200/50 dark:bg-gray-700/50 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
              />
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Today</h2>
            <p className="text-sm text-gray-500">San Francisco</p>
          </div>

          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${zoomLevel + 1}, minmax(0, 1fr))`,
            }}
          >
            {PHOTOS_DATA.map((photo) => (
              <div
                key={photo.id}
                className={`relative group cursor-pointer overflow-hidden rounded-md shadow-sm hover:shadow-md transition-all ${photo.color} ${photo.aspect}`}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 text-white">
                    <Heart size={14} />
                  </button>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 text-white">
                    <Maximize2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-gray-400 pb-8">
            {PHOTOS_DATA.length} Photos, 0 Videos
          </div>
        </div>
      </div>
    </div>
  );
};
