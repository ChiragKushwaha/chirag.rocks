import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Search,
  Music as MusicIcon,
  Radio,
  Mic2,
  ListMusic,
  Volume2,
} from "lucide-react";

export const Music: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    title: "Cruel Summer",
    artist: "Taylor Swift",
    album: "Lover",
    cover: "bg-pink-300",
  });

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-60 bg-[#f5f5f7] dark:bg-[#2b2b2b] border-r border-gray-200 dark:border-black/20 flex flex-col p-4">
        <div className="relative mb-6">
          <Search
            size={14}
            className="absolute left-2.5 top-1.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-200 dark:bg-black/20 border-none rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
              APPLE MUSIC
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-gray-200 dark:bg-white/10 text-red-500">
                <Play size={16} fill="currentColor" />
                <span className="text-sm font-medium">Listen Now</span>
              </div>
              <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
                <ListMusic size={16} />
                <span className="text-sm">Browse</span>
              </div>
              <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
                <Radio size={16} />
                <span className="text-sm">Radio</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
              LIBRARY
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
                <MusicIcon size={16} />
                <span className="text-sm">Songs</span>
              </div>
              <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
                <Mic2 size={16} />
                <span className="text-sm">Artists</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e]">
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold mb-6">Listen Now</h1>

          <h2 className="text-xl font-bold mb-4">Top Picks</h2>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2 group cursor-pointer">
                <div
                  className={`aspect-square rounded-lg shadow-md bg-gradient-to-br ${
                    i === 1
                      ? "from-pink-400 to-purple-500"
                      : i === 2
                      ? "from-blue-400 to-green-500"
                      : i === 3
                      ? "from-yellow-400 to-red-500"
                      : "from-gray-400 to-gray-600"
                  } relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={32} fill="white" className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Album Title {i}</h3>
                  <p className="text-xs text-gray-500">Artist Name</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player Bar */}
        <div className="h-16 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-between px-4 bg-[#f5f5f7]/80 dark:bg-[#2b2b2b]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 w-1/3">
            <div
              className={`w-10 h-10 rounded-md ${currentSong.cover} shadow-sm`}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{currentSong.title}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {currentSong.artist}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 w-1/3">
            <div className="flex items-center gap-6">
              <SkipBack
                size={20}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer"
                fill="currentColor"
              />
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause size={16} fill="currentColor" />
                ) : (
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                )}
              </button>
              <SkipForward
                size={20}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer"
                fill="currentColor"
              />
            </div>
            <div className="w-full max-w-[200px] h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-gray-500 dark:bg-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 w-1/3">
            <Volume2 size={16} className="text-gray-500" />
            <div className="w-20 h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-gray-500 dark:bg-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
