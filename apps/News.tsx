import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Layout, Heart, Share, RefreshCw } from "lucide-react";

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

const CATEGORIES = [
  { id: "general", label: "Top Stories" },
  { id: "technology", label: "Technology" },
  { id: "business", label: "Business" },
  { id: "science", label: "Science" },
  { id: "health", label: "Health" },
  { id: "entertainment", label: "Entertainment" },
  { id: "sports", label: "Sports" },
];

export const News: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("general");
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const fetchNews = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      // Using saurav.tech NewsAPI proxy (Open Source & Free)
      const response = await fetch(
        `https://saurav.tech/NewsAPI/top-headlines/category/${category}/us.json`
      );
      if (!response.ok) throw new Error("Failed to fetch news");
      const data: NewsResponse = await response.json();
      setArticles(data.articles);
    } catch (err) {
      setError("Failed to load news. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  // Filter articles based on search query
  const filteredArticles = articles.filter((article) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title?.toLowerCase().includes(query) ||
      article.description?.toLowerCase().includes(query)
    );
  });

  const featuredArticle = filteredArticles[0];
  const listArticles = filteredArticles.slice(1);

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-60 bg-[#f5f5f7] dark:bg-[#2b2b2b] border-r border-gray-200 dark:border-black/20 flex flex-col p-4">
        <div className="flex items-center gap-2 mb-6 px-2">
          <span className="text-xl font-bold text-red-500">News</span>
        </div>

        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery(""); // Clear search when changing category
                setIsSearchActive(false);
              }}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                activeCategory === cat.id && !isSearchActive
                  ? "bg-gray-200 dark:bg-white/10 font-medium"
                  : "hover:bg-gray-200 dark:hover:bg-white/5"
              }`}
            >
              {cat.id === "general" ? (
                <Layout size={16} className="text-red-500" />
              ) : (
                <span className="w-4 h-4" /> // Spacer for alignment
              )}
              <span className="text-sm">{cat.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-300 dark:border-white/10 pt-4">
          <div
            className={`flex items-center gap-3 px-2 py-1.5 rounded-md transition-colors ${
              isSearchActive
                ? "bg-gray-200 dark:bg-white/10"
                : "hover:bg-gray-200 dark:hover:bg-white/5"
            }`}
            onClick={() => setIsSearchActive(true)}
          >
            <Search
              size={16}
              className={isSearchActive ? "text-blue-500" : "text-gray-500"}
            />
            {isSearchActive ? (
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-500"
                autoFocus
                onBlur={() => {
                  if (!searchQuery) setIsSearchActive(false);
                }}
              />
            ) : (
              <span className="text-sm text-gray-500">Search</span>
            )}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-[#1e1e1e]">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1 capitalize">
              {searchQuery
                ? `Search: "${searchQuery}"`
                : CATEGORIES.find((c) => c.id === activeCategory)?.label}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => fetchNews(activeCategory)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Loading top stories...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={() => fetchNews(activeCategory)}
              className="text-blue-500 hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-500 text-lg">
              No stories found matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-blue-500 hover:underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Featured Article */}
            {featuredArticle && (
              <div
                className="group cursor-pointer"
                onClick={() => window.open(featuredArticle.url, "_blank")}
              >
                <div className="aspect-[2/1] bg-gray-200 dark:bg-gray-800 rounded-xl mb-4 overflow-hidden relative">
                  {featuredArticle.urlToImage ? (
                    <Image
                      src={featuredArticle.urlToImage}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <span className="text-4xl">📰</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <span className="text-red-500 font-bold text-sm mb-2 uppercase tracking-wide">
                      Top Story
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2 drop-shadow-md">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-200 line-clamp-2 drop-shadow-sm">
                      {featuredArticle.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Article List */}
            <div className="grid grid-cols-1 gap-6">
              {listArticles.map((article, idx) => (
                <div
                  key={article.url + idx}
                  className="flex gap-4 group cursor-pointer border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0"
                  onClick={() => window.open(article.url, "_blank")}
                >
                  <div className="w-32 h-24 rounded-lg flex-shrink-0 bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                    {article.urlToImage ? (
                      <Image
                        src={article.urlToImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📰
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-red-500 uppercase truncate max-w-[150px]">
                          {article.source.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(article.publishedAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {article.description}
                      </p>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <button
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Share logic placeholder
                        }}
                      >
                        <Share size={14} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Like logic placeholder
                        }}
                      >
                        <Heart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
