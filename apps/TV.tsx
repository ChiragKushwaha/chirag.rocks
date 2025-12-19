import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Play,
  Plus,
  Search,
  Check,
  X,
  Home,
  Film,
  Tv,
  Baby,
  Library,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Show {
  id: number;
  name: string;
  image: {
    medium: string;
    original: string;
  };
  summary: string;
  genres: string[];
  rating: {
    average: number;
  };
}

export const TV: React.FC = () => {
  const t = useTranslations("TV");
  const [activeTab, setActiveTab] = useState("watch-now");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingShow, setPlayingShow] = useState<Show | null>(null);
  const [heroShow, setHeroShow] = useState<Show | null>(null);

  // Library state remains local
  const [library, setLibrary] = useState<Show[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mac-tv-library");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("mac-tv-library", JSON.stringify(library));
  }, [library]);

  const { data: shows = [], isLoading: loading } = useQuery({
    queryKey: ["tv-shows"],
    queryFn: async () => {
      const response = await fetch("https://api.tvmaze.com/shows");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json() as Promise<Show[]>;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Set hero show once data is loaded
  useEffect(() => {
    if (shows.length > 0) {
      // eslint-disable-next-line
      setHeroShow(
        (prev) => prev || shows[Math.floor(Math.random() * shows.length)]
      );
    }
  }, [shows]);

  const categories = [
    "Drama",
    "Action",
    "Comedy",
    "Science-Fiction",
    "Thriller",
  ];

  const getShowsByGenre = (genre: string) => {
    return shows
      .filter((show) => show.genres.includes(genre))
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, 10);
  };

  const toggleLibrary = (show: Show) => {
    if (library.find((s) => s.id === show.id)) {
      setLibrary(library.filter((s) => s.id !== show.id));
    } else {
      setLibrary([...library, show]);
    }
  };

  const isInLibrary = (show: Show) => library.some((s) => s.id === show.id);

  const getTabContent = () => {
    if (searchQuery) {
      return shows.filter((show) =>
        show.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeTab) {
      case "movies":
        return shows.filter((show) =>
          show.genres.some((g) =>
            [
              "Action",
              "Adventure",
              "Thriller",
              "Science-Fiction",
              "Horror",
            ].includes(g)
          )
        );
      case "tv-shows":
        return shows.filter((show) =>
          show.genres.some((g) =>
            [
              "Drama",
              "Comedy",
              "Romance",
              "Family",
              "Legal",
              "Medical",
            ].includes(g)
          )
        );
      case "kids":
        return shows.filter((show) =>
          show.genres.some((g) => ["Children", "Anime", "Family"].includes(g))
        );
      case "library":
        return library;
      default:
        return shows;
    }
  };

  const navItems = [
    { id: "watch-now", label: t("WatchNow"), icon: Home },
    { id: "movies", label: t("Movies"), icon: Film },
    { id: "tv-shows", label: t("TVShows"), icon: Tv },
    { id: "kids", label: t("Kids"), icon: Baby },
    { id: "library", label: t("Library"), icon: Library },
  ];

  const renderGrid = (items: Show[]) => (
    <div className="px-8 py-8">
      <h2 className="text-2xl font-bold mb-6 text-white/90">
        {searchQuery
          ? t("SearchResults")
          : activeTab === "library"
          ? t("Library")
          : activeTab === "movies"
          ? t("Movies")
          : activeTab === "tv-shows"
          ? t("TVShows")
          : t("Kids")}
      </h2>
      {items.length === 0 ? (
        <div className="text-gray-400 text-lg">{t("NoShows")}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map((show) => (
            <div
              key={show.id}
              className="aspect-2/3 relative rounded-xl overflow-hidden cursor-pointer group bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:z-10"
              onClick={() => setPlayingShow(show)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setPlayingShow(show);
                }
              }}
              aria-label={t("Aria.Play", { name: show.name })}
            >
              <Image
                src={show.image?.medium || ""}
                alt={show.name}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Play size={24} className="text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="font-bold text-sm text-white truncate">
                  {show.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span>{show.rating.average || "N/A"}</span>
                    <span>•</span>
                    <span className="truncate">{show.genres[0]}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLibrary(show);
                    }}
                    className="p-1 hover:bg-white/20 rounded-full"
                    aria-label={
                      isInLibrary(show)
                        ? t("Aria.RemoveLibrary")
                        : t("Aria.AddLibrary")
                    }
                  >
                    {isInLibrary(show) ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Plus size={14} className="text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#1e1e1e] text-white font-sans overflow-hidden relative select-none">
      {/* Video Overlay */}
      {playingShow && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300 p-8">
          <button
            onClick={() => setPlayingShow(null)}
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 backdrop-blur-md"
            aria-label={t("Aria.CloseVideo")}
          >
            <X size={24} />
          </button>

          <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden relative shadow-2xl border border-white/10 group">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
                playingShow.name + " official trailer"
              )}&autoplay=1&mute=0`}
              title={`${playingShow.name} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="mt-6 flex gap-4">
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                playingShow.name + " official trailer"
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
            >
              <ExternalLink size={16} />
              {t("OpenYouTube")}
            </a>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-[#2C2C2E]/50 backdrop-blur-2xl border-r border-white/10 flex flex-col pt-8 pb-4 px-4 z-20">
        <div className="mb-6 px-2 relative group">
          <Search
            size={14}
            className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-white transition-colors"
          />
          <input
            type="text"
            placeholder={t("SearchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={t("SearchLabel")}
            className="w-full bg-black/20 border-none rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 text-white placeholder-gray-500 transition-all"
          />
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSearchQuery("");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon
                size={18}
                className={
                  activeTab === item.id ? "text-[#007AFF]" : "text-gray-500"
                }
              />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
              CK
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white">Chirag</span>
              <span className="text-[10px] text-gray-400">
                {t("ViewAccount")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#1e1e1e]">
        {searchQuery || activeTab !== "watch-now" ? (
          renderGrid(getTabContent())
        ) : (
          <>
            {/* Hero Section */}
            {heroShow && (
              <div className="relative h-[70vh] w-full flex items-end pb-20 px-12 group overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <Image
                    src={
                      heroShow.image?.original || heroShow.image?.medium || ""
                    }
                    alt={heroShow.name}
                    fill
                    className="object-cover opacity-80 mask-image-b-transparent scale-105 group-hover:scale-100 transition-transform duration-[20s]"
                    unoptimized
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1e1e1e] via-[#1e1e1e]/20 to-transparent" />
                  <div className="absolute inset-0 bg-linear-to-r from-[#1e1e1e] via-[#1e1e1e]/40 to-transparent" />
                </div>

                <div className="relative z-10 max-w-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-white text-black text-[10px] font-bold rounded uppercase tracking-wider shadow-lg">
                      {t("Series")}
                    </span>
                    <span className="text-sm font-medium text-gray-200 drop-shadow-md">
                      {heroShow.genres.join(" • ")}
                    </span>
                  </div>
                  <h1 className="text-6xl font-bold mb-4 leading-tight tracking-tight drop-shadow-2xl text-white">
                    {heroShow.name}
                  </h1>
                  <div
                    className="text-lg text-gray-200 mb-8 line-clamp-3 drop-shadow-md font-medium leading-relaxed max-w-xl"
                    dangerouslySetInnerHTML={{ __html: heroShow.summary }}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() => setPlayingShow(heroShow)}
                      className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-xl shadow-black/20"
                    >
                      <Play size={20} fill="currentColor" />
                      {t("PlayEpisode")}
                    </button>
                    <button
                      onClick={() => toggleLibrary(heroShow)}
                      className="flex items-center gap-2 px-8 py-3 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 backdrop-blur-md transition-colors border border-white/10"
                    >
                      {isInLibrary(heroShow) ? (
                        <>
                          <Check size={20} />
                          {t("Added")}
                        </>
                      ) : (
                        <>
                          <Plus size={20} />
                          {t("AddToUpNext")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="px-12 pb-12 space-y-12 -mt-10 relative z-10">
              {categories.map((genre) => {
                const genreShows = getShowsByGenre(genre);
                if (genreShows.length === 0) return null;

                return (
                  <section key={genre}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white/90 flex items-center gap-2">
                        {genre === "Drama"
                          ? t("Genres.Drama")
                          : genre === "Action"
                          ? t("Genres.Action")
                          : genre === "Comedy"
                          ? t("Genres.Comedy")
                          : genre === "Science-Fiction"
                          ? t("Genres.ScienceFiction")
                          : genre === "Thriller"
                          ? t("Genres.Thriller")
                          : genre}
                        <span className="text-gray-500 text-sm font-normal">
                          &gt;
                        </span>
                      </h2>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-12 px-12 pt-2">
                      {genreShows.map((show) => (
                        <div
                          key={show.id}
                          className="shrink-0 w-[220px] aspect-2/3 bg-gray-800 rounded-xl relative group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 hover:z-10 ring-1 ring-white/5"
                          onClick={() => setPlayingShow(show)}
                        >
                          <Image
                            src={show.image?.medium || ""}
                            alt={show.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                              <Play
                                size={28}
                                className="text-white fill-white ml-1"
                              />
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <h3 className="font-bold text-sm text-white truncate">
                              {show.name}
                            </h3>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-[10px] text-gray-300">
                                {show.rating.average} ★
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLibrary(show);
                                }}
                                className="p-1 hover:bg-white/20 rounded-full"
                              >
                                {isInLibrary(show) ? (
                                  <Check size={14} className="text-green-400" />
                                ) : (
                                  <Plus size={14} className="text-white" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
