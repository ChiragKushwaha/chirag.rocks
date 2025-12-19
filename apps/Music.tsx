import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
  Volume1,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Menu,
  Quote,
  Clock,
  Disc,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl: string;
}

interface HistoryItem {
  tab: string;
  query: string;
}

export const Music: React.FC = () => {
  const t = useTranslations("Music");
  const [activeTab, setActiveTab] = useState("listen-now");
  const [searchQuery, setSearchQuery] = useState("");
  // songs is now derived from query
  const [queue, setQueue] = useState<Song[]>([]); // Songs in playback queue
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Navigation History
  const [history, setHistory] = useState<HistoryItem[]>([
    { tab: "listen-now", query: "top hits 2024" },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Side Panels
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Update audio source and play when currentSong changes
  useEffect(() => {
    if (audioRef.current && currentSong?.previewUrl) {
      audioRef.current.src = currentSong.previewUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Playback error:", err);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong]);

  // Handle play/pause when isPlaying changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Playback error:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  // Update volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // ... inside Music component

  // Ensure these states are defined: activeTab, searchQuery
  // We need a specific "query term" for the API, distinct from the UI search input/tab.
  // Actually, the app logic is: navigate(tab, query) -> fetchSongs(query).
  // So a single state `apiQuery` can drive the fetch.

  const [apiQuery, setApiQuery] = useState("top hits 2024");

  const { data: songs = [], isLoading: songsLoading } = useQuery({
    queryKey: ["music", apiQuery],
    queryFn: async () => {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          apiQuery
        )}&media=music&entity=song&limit=50`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data.results as Song[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!apiQuery,
  });

  // Sync loading state if needed, or replace `loading` with `songsLoading` in render.
  // The original component uses `loading` state.
  useEffect(() => {
    setLoading(songsLoading);
  }, [songsLoading]);

  // Remove the simple fetchSongs function.
  // We update `navigate` to set `apiQuery`.

  const navigate = (tab: string, query: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ tab, query });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setActiveTab(tab);
    if (tab === "search") {
      setSearchQuery(query);
    } else {
      setSearchQuery("");
    }
    setApiQuery(query);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const item = history[newIndex];
      setHistoryIndex(newIndex);
      setActiveTab(item.tab);
      if (item.tab === "search") setSearchQuery(item.query);
      else setSearchQuery("");
      setApiQuery(item.query);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const item = history[newIndex];
      setHistoryIndex(newIndex);
      setActiveTab(item.tab);
      if (item.tab === "search") setSearchQuery(item.query);
      else setSearchQuery("");
      setApiQuery(item.query);
    }
  };

  const handlePlaySong = (song: Song) => {
    if (currentSong?.trackId === song.trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setQueue(songs); // Update queue to match current view
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex(
      (s) => s.trackId === currentSong.trackId
    );
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex(
      (s) => s.trackId === currentSong.trackId
    );
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentSong(queue[prevIndex]);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("search", searchQuery);
    }
  };

  const getHighResArtwork = (url: string) => {
    return url.replace("100x100bb", "600x600bb");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      );
    }

    return (
      <div className="p-8 pb-32">
        <h1 className="text-3xl font-bold mb-6 capitalize text-gray-900 dark:text-white">
          {activeTab === "search"
            ? t("SearchTitle", { query: searchQuery })
            : activeTab === "listen-now"
            ? t("ListenNow")
            : activeTab === "browse"
            ? t("Browse")
            : activeTab === "radio"
            ? t("Radio")
            : activeTab === "recently-added"
            ? t("RecentlyAdded")
            : activeTab === "artists"
            ? t("Artists")
            : activeTab === "albums"
            ? t("Albums")
            : activeTab === "songs"
            ? t("Songs")
            : activeTab.replace("-", " ")}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-10">
          {songs.map((song) => (
            <div
              key={song.trackId}
              className="group cursor-pointer"
              onClick={() => handlePlaySong(song)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handlePlaySong(song);
                }
              }}
              aria-label={t("Aria.PlaySong", {
                track: song.trackName,
                artist: song.artistName,
              })}
            >
              <div className="aspect-square rounded-lg shadow-md bg-gray-200 dark:bg-gray-800 relative overflow-hidden mb-3 group-hover:shadow-xl transition-all duration-300">
                <Image
                  src={getHighResArtwork(song.artworkUrl100)}
                  alt={song.trackName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div
                  className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${
                    currentSong?.trackId === song.trackId && isPlaying
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                  role="button"
                  aria-label={
                    currentSong?.trackId === song.trackId && isPlaying
                      ? t("Aria.PauseSong", { track: song.trackName })
                      : t("Aria.PlaySong", {
                          track: song.trackName,
                          artist: song.artistName,
                        })
                  }
                >
                  <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    {currentSong?.trackId === song.trackId && isPlaying ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" className="ml-1" />
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium truncate text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">
                  {song.trackName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {song.artistName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans overflow-hidden select-none">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNext}
        onError={(e) => console.error("Audio error:", e)}
      />

      {/* Sidebar */}
      <div className="w-64 bg-[#f5f5f7]/90 dark:bg-[#2b2b2b]/90 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 flex flex-col pt-8 pb-4 px-4 z-20">
        <form onSubmit={handleSearch} className="relative mb-6 px-2">
          <Search size={14} className="absolute left-5 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder={t("Search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-black/20 border-none rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-sm text-gray-900 dark:text-white placeholder-gray-500"
            aria-label={t("Aria.Search")}
          />
        </form>

        <div className="space-y-6 px-2 overflow-y-auto scrollbar-hide">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase tracking-wider">
              {t("AppleMusic")}
            </h3>
            <div className="space-y-0.5">
              {[
                {
                  id: "listen-now",
                  label: t("ListenNow"),
                  icon: Play,
                  query: "top hits 2024",
                },
                {
                  id: "browse",
                  label: t("Browse"),
                  icon: ListMusic,
                  query: "pop music",
                },
                {
                  id: "radio",
                  label: t("Radio"),
                  icon: Radio,
                  query: "radio hits",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id, item.query)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-gray-200 dark:bg-white/10 text-red-500"
                      : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={
                      activeTab === item.id ? "text-red-500" : "text-gray-400"
                    }
                    fill={item.id === "listen-now" ? "currentColor" : "none"}
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase tracking-wider">
              {t("Library")}
            </h3>
            <div className="space-y-0.5">
              {[
                {
                  id: "recently-added",
                  label: t("RecentlyAdded"),
                  icon: Clock,
                  query: "new music",
                },
                {
                  id: "artists",
                  label: t("Artists"),
                  icon: Mic2,
                  query: "top artists",
                },
                {
                  id: "albums",
                  label: t("Albums"),
                  icon: Disc,
                  query: "top albums",
                },
                {
                  id: "songs",
                  label: t("Songs"),
                  icon: MusicIcon,
                  query: "essential hits",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id, item.query)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-gray-200 dark:bg-white/10 text-red-500"
                      : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={
                      activeTab === item.id ? "text-red-500" : "text-gray-400"
                    }
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e] overflow-hidden relative">
        {/* Top Player Bar (Toolbar) */}
        <div className="h-16 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 bg-[#f5f5f7]/80 dark:bg-[#2b2b2b]/80 backdrop-blur-xl z-30 shrink-0">
          {/* Left: Navigation */}
          <div className="flex items-center gap-4 w-1/4">
            <div className="flex items-center gap-1 text-gray-500">
              <button
                onClick={handleBack}
                disabled={historyIndex <= 0}
                className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md disabled:opacity-30 transition-opacity"
                aria-label={t("Aria.GoBack")}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleForward}
                disabled={historyIndex >= history.length - 1}
                className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md disabled:opacity-30 transition-opacity"
                aria-label={t("Aria.GoForward")}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Center: Player Controls & LCD */}
          <div className="flex flex-col items-center justify-center w-2/4">
            {/* Controls */}
            <div className="flex items-center gap-6 mb-1">
              <button
                onClick={playPrev}
                disabled={!currentSong}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors disabled:opacity-30"
                aria-label={t("Aria.Prev")}
              >
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button
                onClick={() => currentSong && setIsPlaying(!isPlaying)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                  currentSong
                    ? "bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white"
                    : "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!currentSong}
                aria-label={isPlaying ? t("Aria.Pause") : t("Aria.Play")}
              >
                {isPlaying ? (
                  <Pause size={16} fill="currentColor" />
                ) : (
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                )}
              </button>
              <button
                onClick={playNext}
                disabled={!currentSong}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors disabled:opacity-30"
                aria-label={t("Aria.Next")}
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>

            {/* LCD / Progress */}
            <div className="w-full max-w-[400px] h-8 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-md flex items-center px-3 gap-3 relative overflow-hidden group">
              {currentSong ? (
                <>
                  <div className="w-6 h-6 rounded bg-gray-300 dark:bg-gray-700 shrink-0 relative overflow-hidden">
                    <Image
                      src={currentSong.artworkUrl100}
                      alt="Cover"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden w-full relative z-10">
                    <div className="flex items-center justify-between text-[10px] font-medium text-gray-900 dark:text-white leading-tight">
                      <span className="truncate">{currentSong.trackName}</span>
                      <span className="text-gray-500 dark:text-gray-400 tabular-nums">
                        {formatTime(currentTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                      <span className="truncate">{currentSong.artistName}</span>
                      <span className="tabular-nums">
                        -{formatTime(duration - currentTime)}
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar Overlay */}
                  <div className="absolute bottom-0 left-0 h-[2px] bg-gray-300 dark:bg-gray-600 w-full">
                    <div
                      className="h-full bg-gray-500 dark:bg-gray-400 transition-all duration-100 ease-linear"
                      style={{
                        width: `${(currentTime / (duration || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  {/* Interactive Range Input (Hidden but clickable) */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    disabled={!currentSong}
                    aria-label={t("Aria.SeekSlider")}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center w-full text-xs text-gray-400">
                  <MusicIcon size={14} className="mr-2" />
                  {t("AppleMusic")}
                </div>
              )}
            </div>
          </div>

          {/* Right: Volume & Extras */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            <button
              onClick={() => {
                setShowLyrics(!showLyrics);
                setShowQueue(false);
              }}
              className={`p-1 rounded-md transition-all ${
                showLyrics
                  ? "bg-gray-200 dark:bg-white/10 text-red-500 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
              aria-label={t("Aria.Lyrics")}
            >
              <Quote size={18} fill={showLyrics ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => {
                setShowQueue(!showQueue);
                setShowLyrics(false);
              }}
              className={`p-1 rounded-md transition-all ${
                showQueue
                  ? "bg-gray-200 dark:bg-white/10 text-red-500 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
              aria-label={t("Aria.Queue")}
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 w-24">
              <button
                onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                aria-label={t("Aria.Mute")}
              >
                {volume === 0 ? (
                  <VolumeX size={16} className="text-gray-500" />
                ) : volume < 0.5 ? (
                  <Volume1 size={16} className="text-gray-500" />
                ) : (
                  <Volume2 size={16} className="text-gray-500" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-gray-500 dark:accent-gray-400"
                aria-label={t("Aria.VolSlider")}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative flex">
          {/* Main Grid */}
          <div className="flex-1 overflow-y-auto">{renderContent()}</div>

          {/* Lyrics Panel */}
          {showLyrics && (
            <div className="w-80 bg-[#f5f5f7]/95 dark:bg-[#2b2b2b]/95 backdrop-blur-xl border-l border-gray-200 dark:border-white/10 p-6 overflow-y-auto animate-in slide-in-from-right duration-300 absolute right-0 top-0 bottom-0 z-20 shadow-xl flex flex-col">
              {currentSong ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {currentSong.trackName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentSong.artistName}
                    </p>
                  </div>
                  <div className="space-y-4 text-lg font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>{t("Lyrics.NotAvailable")}</p>
                    <p className="opacity-50">{t("Lyrics.Imagine")}</p>
                    <p className="opacity-30">{t("Lyrics.Lalala")}</p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-center">
                  <div>
                    <Quote size={48} className="mx-auto mb-4 opacity-20" />
                    <p>{t("Lyrics.Placeholder")}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Queue Panel */}
          {showQueue && (
            <div className="w-80 bg-[#f5f5f7]/95 dark:bg-[#2b2b2b]/95 backdrop-blur-xl border-l border-gray-200 dark:border-white/10 p-4 overflow-y-auto animate-in slide-in-from-right duration-300 absolute right-0 top-0 bottom-0 z-20 shadow-xl">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                {t("Queue.Title")}
              </h3>
              <div className="space-y-2">
                {queue.length > 0 ? (
                  queue.map((song, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setCurrentSong(song);
                        setIsPlaying(true);
                      }}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer group ${
                        currentSong?.trackId === song.trackId
                          ? "bg-gray-200 dark:bg-white/10"
                          : "hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setCurrentSong(song);
                          setIsPlaying(true);
                        }
                      }}
                      aria-label={t("Aria.PlaySong", {
                        track: song.trackName,
                        artist: song.artistName,
                      })}
                    >
                      <div className="w-10 h-10 rounded bg-gray-300 dark:bg-gray-700 relative overflow-hidden shrink-0">
                        <Image
                          src={song.artworkUrl100}
                          alt={song.trackName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {currentSong?.trackId === song.trackId && isPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-sm font-medium truncate ${
                            currentSong?.trackId === song.trackId
                              ? "text-red-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {song.trackName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {song.artistName}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {t("Queue.Empty")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
