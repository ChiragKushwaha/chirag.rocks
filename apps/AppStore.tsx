import React, { useState } from "react";
import {
  Search, LayoutGrid, Gamepad2, PenTool, Layers, Star, User,
  Download, TrendingUp
} from "lucide-react";

const FEATURED_APPS = [
  { name: "Xcode", category: "Developer Tools", icon: "🛠️", rating: 4.5, price: "Free", color: "from-blue-500 to-cyan-500" },
  { name: "Final Cut Pro", category: "Video", icon: "🎬", rating: 4.8, price: "$299.99", color: "from-gray-700 to-gray-900" },
  { name: "Logic Pro", category: "Music", icon: "🎵", rating: 4.9, price: "$199.99", color: "from-slate-600 to-slate-800" },
  { name: "Affinity Designer", category: "Graphics", icon: "🎨", rating: 4.6, price: "$54.99", color: "from-blue-700 to-purple-700" },
];

const TOP_FREE = [
  { name: "Microsoft To Do", icon: "✅", rating: 4.7, category: "Productivity" },
  { name: "WhatsApp", icon: "💬", rating: 4.5, category: "Social" },
  { name: "Notion", icon: "📝", rating: 4.6, category: "Productivity" },
  { name: "Slack", icon: "💼", rating: 4.4, category: "Business" },
  { name: "Spotify", icon: "🎵", rating: 4.7, category: "Music" },
  { name: "Zoom", icon: "📹", rating: 4.3, category: "Utilities" },
];

const NAV_ITEMS = [
  { id: "discover", label: "Discover", icon: LayoutGrid },
  { id: "arcade", label: "Arcade", icon: Gamepad2 },
  { id: "create", label: "Create", icon: PenTool },
  { id: "work", label: "Work", icon: Layers },
  { id: "play", label: "Play", icon: Star },
];

export const AppStore: React.FC = () => {
  const [activeNav, setActiveNav] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif] text-[13px] select-none overflow-hidden">
      {/* ── SIDEBAR ── */}
      <div className="w-[200px] bg-[#f5f5f7] dark:bg-[#272727] border-r border-gray-200/70 dark:border-black/25 flex flex-col shrink-0">
        {/* Search */}
        <div className="px-3 pt-4 pb-3">
          <div className="relative">
            <Search size={12} className="absolute left-2 top-[7px] text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search"
              className="w-full bg-[#dcdce0] dark:bg-[#3a3a3a] border-none rounded-[6px] pl-7 pr-3 py-1 text-[12px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              aria-label="Search apps"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="px-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[6px] mb-0.5 text-left transition-colors ${
                  isActive
                    ? "bg-[#007AFF] text-white"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
                }`}
              >
                <Icon size={15} className={isActive ? "text-white" : "text-[#007AFF]"} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User account */}
        <div className="px-3 py-3 border-t border-gray-200/60 dark:border-black/15">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 cursor-default transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User size={12} className="text-white" />
            </div>
            <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300">Chirag</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1e1e1e]">
        {/* Hero Banner */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden shrink-0">
          <div className="absolute inset-0 flex items-center justify-between px-10">
            <div>
              <div className="text-white/70 text-[11px] font-semibold uppercase tracking-widest mb-1">App of the Day</div>
              <h2 className="text-white text-3xl font-bold mb-1">Fantastical</h2>
              <p className="text-white/80 text-[13px]">The best calendar app for Mac, iPad, and iPhone.</p>
            </div>
            <div className="w-28 h-28 rounded-[22px] bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-5xl shadow-2xl">
              📅
            </div>
          </div>
          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-white/40"}`} />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Featured Apps */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold">Featured Apps</h2>
              <button className="text-[#007AFF] text-[12px] font-medium hover:opacity-70">See All</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {FEATURED_APPS.map((app) => (
                <div key={app.name} className="flex items-center gap-3 p-3 rounded-[12px] bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-default transition-colors">
                  <div className={`w-14 h-14 rounded-[14px] bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shrink-0 shadow-sm`}>
                    {app.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13px] truncate">{app.name}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">{app.category}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                        {"★".repeat(Math.floor(app.rating))}
                        <span className="text-gray-400 ml-1">{app.rating}</span>
                      </div>
                      <button className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20 transition-colors">
                        {app.price === "Free" ? "Get" : app.price}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Free */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-green-500" />
                Top Free Apps
              </h2>
              <button className="text-[#007AFF] text-[12px] font-medium hover:opacity-70">See All</button>
            </div>
            <div className="space-y-0">
              {TOP_FREE.map((app, i) => (
                <div key={app.name} className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/3 rounded-lg px-1 cursor-default transition-colors">
                  <span className="text-[13px] font-bold text-gray-400 w-5 text-right shrink-0">{i + 1}</span>
                  <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl shrink-0">
                    {app.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13px]">{app.name}</div>
                    <div className="text-[11px] text-gray-400">{app.category}</div>
                  </div>
                  <button className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20 transition-colors shrink-0">
                    Get
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section>
            <h2 className="text-[18px] font-bold mb-4">Browse Categories</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Productivity", color: "from-blue-500 to-blue-700", icon: "📊" },
                { name: "Games", color: "from-purple-500 to-pink-600", icon: "🎮" },
                { name: "Photo & Video", color: "from-orange-500 to-red-600", icon: "📸" },
                { name: "Music", color: "from-pink-500 to-rose-600", icon: "🎵" },
                { name: "Finance", color: "from-green-500 to-teal-600", icon: "💰" },
                { name: "Utilities", color: "from-gray-500 to-gray-700", icon: "🔧" },
              ].map((cat) => (
                <button
                  key={cat.name}
                  className={`h-16 rounded-[12px] bg-gradient-to-br ${cat.color} flex items-center gap-3 px-4 text-white hover:opacity-90 transition-opacity cursor-default`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-[13px] font-semibold">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
