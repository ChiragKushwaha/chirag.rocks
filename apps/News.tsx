import React from "react";
import { Search, Layout, Heart, Share } from "lucide-react";

export const News: React.FC = () => {
  const articles = [
    {
      id: 1,
      source: "The Verge",
      title: "Apple announces new MacBook Pro with M3 chips",
      summary:
        "The new lineup features the M3, M3 Pro, and M3 Max chips, bringing significant performance improvements.",
      image: "bg-blue-900",
      time: "2h ago",
    },
    {
      id: 2,
      source: "TechCrunch",
      title: "AI startup raises $100M to build coding assistants",
      summary: "The funding round was led by major venture capital firms.",
      image: "bg-green-900",
      time: "4h ago",
    },
    {
      id: 3,
      source: "Bloomberg",
      title: "Market rally continues as inflation data cools",
      summary:
        "Stocks surged today following the release of the latest CPI report.",
      image: "bg-red-900",
      time: "5h ago",
    },
  ];

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-60 bg-[#f5f5f7] dark:bg-[#2b2b2b] border-r border-gray-200 dark:border-black/20 flex flex-col p-4">
        <div className="flex items-center gap-2 mb-6 px-2">
          <span className="text-xl font-bold text-red-500">News</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-gray-200 dark:bg-white/10">
            <Layout size={16} className="text-red-500" />
            <span className="text-sm font-medium">Today</span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
            <Heart size={16} className="text-pink-500" />
            <span className="text-sm">Following</span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
            <Search size={16} />
            <span className="text-sm">Search</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
            TOPICS
          </h3>
          <div className="space-y-1">
            {[
              "Technology",
              "Science",
              "Business",
              "Sports",
              "Entertainment",
            ].map((topic) => (
              <div
                key={topic}
                className="px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5 text-sm cursor-pointer"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-[#1e1e1e]">
        <h1 className="text-3xl font-bold mb-1">Today</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm font-medium uppercase">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Featured Article */}
          <div className="group cursor-pointer">
            <div className="aspect-[2/1] bg-gray-200 dark:bg-gray-800 rounded-xl mb-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <span className="text-red-500 font-bold text-sm mb-2 uppercase tracking-wide">
                  Top Story
                </span>
                <h2 className="text-3xl font-bold text-white leading-tight mb-2">
                  SpaceX successfully launches Starship on third test flight
                </h2>
                <p className="text-gray-200 line-clamp-2">
                  The massive rocket reached orbit for the first time, marking a
                  major milestone for the company's Mars ambitions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex gap-4 group cursor-pointer border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0"
              >
                <div
                  className={`w-32 h-24 rounded-lg flex-shrink-0 ${article.image}`}
                />
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-red-500 uppercase">
                        {article.source}
                      </span>
                      <span className="text-xs text-gray-400">
                        {article.time}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold leading-snug group-hover:text-red-500 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <Share size={14} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <Heart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
