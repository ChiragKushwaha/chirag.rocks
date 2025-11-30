import React from "react";
import { Play, Plus, Search } from "lucide-react";

export const TV: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white font-sans">
      {/* Toolbar */}
      <div className="h-12 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div className="flex gap-8 text-sm font-medium text-gray-300">
          <span className="text-white cursor-pointer">Watch Now</span>
          <span className="hover:text-white cursor-pointer">Movies</span>
          <span className="hover:text-white cursor-pointer">TV Shows</span>
          <span className="hover:text-white cursor-pointer">Kids</span>
          <span className="hover:text-white cursor-pointer">Library</span>
        </div>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search"
            className="bg-white/10 border-none rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 w-48"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="relative h-[400px] w-full bg-gradient-to-r from-blue-900 to-black flex items-center px-12">
          <div className="w-1/2 z-10">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              Ted Lasso
            </h1>
            <p className="text-lg text-gray-200 mb-6 drop-shadow-md max-w-lg">
              An American football coach is hired to manage a British soccer
              team; what he lacks in knowledge, he makes up for with optimism,
              determination... and biscuits.
            </p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-200">
                <Play size={18} fill="currentColor" />
                Play Episode 1
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-white/20 text-white rounded-md font-semibold hover:bg-white/30 backdrop-blur-sm">
                <Plus size={18} />
                Add to Up Next
              </button>
            </div>
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-transparent to-transparent" />
        </div>

        {/* Horizontal Scroll Sections */}
        <div className="px-12 py-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">Up Next</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 aspect-video bg-gray-800 rounded-lg relative group cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <Play size={32} fill="white" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">New Releases</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-40 aspect-[2/3] bg-gray-800 rounded-lg relative group cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
