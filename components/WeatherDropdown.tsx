import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  getWeatherInfo,
  WeatherData,
  fetchWeather,
  searchLocation,
} from "../lib/weatherApi";
import { MapPin, Search } from "lucide-react";
import { useProcessStore } from "../store/processStore";
import { Weather } from "../apps/Weather";
import { WeatherIcon } from "./icons/WeatherIcon";

interface WeatherDropdownProps {
  weather: WeatherData;
  isOpen: boolean;
  onClose: () => void;
  toggleRef: React.RefObject<HTMLElement | null>;
}

export const WeatherDropdown: React.FC<WeatherDropdownProps> = ({
  weather,
  isOpen,
  onClose,
  toggleRef,
}) => {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { launchProcess } = useProcessStore();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<WeatherData>(weather);

  // Update local weather state when prop changes
  useEffect(() => {
    setCurrentWeather(weather);
  }, [weather]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      const results = await searchLocation(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const selectLocation = async (loc: any) => {
    setIsSearching(true);
    try {
      const newWeather = await fetchWeather(loc.lat, loc.lon, loc.name);
      setCurrentWeather(newWeather);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to fetch weather for selected location", error);
    } finally {
      setIsSearching(false);
    }
  };

  const openWeatherApp = () => {
    launchProcess("weather", "Weather", WeatherIcon, <Weather />);
    onClose();
  };

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClick);
    }
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose, toggleRef]);

  const [right, setRight] = useState(10);

  useEffect(() => {
    if (isOpen && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setRight(window.innerWidth - rect.right);
    }
  }, [isOpen, toggleRef]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={ref}
      className="fixed top-8 z-9000 w-80 bg-black/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden text-white font-sans animate-in fade-in zoom-in-95 duration-200 origin-top-right"
      style={{ right }}
    >
      {/* Search Bar */}
      <div className="p-3 border-b border-white/10 bg-white/5">
        <div className="relative group">
          <Search
            className="absolute left-2 top-1.5 text-white/50 group-focus-within:text-white transition-colors"
            size={14}
          />
          <input
            type="text"
            placeholder={isSearching ? "Searching..." : "Search city..."}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-3 py-1 text-sm text-white placeholder-white/40 focus:outline-none focus:bg-black/40 focus:border-white/30 transition-all"
          />
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E1E] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 max-h-48 overflow-y-auto">
              {searchResults.map((result, i) => (
                <div
                  key={i}
                  className="px-3 py-2 hover:bg-white/10 cursor-pointer text-sm flex flex-col"
                  onClick={() => selectLocation(result)}
                >
                  <span className="font-medium">{result.name}</span>
                  <span className="text-xs opacity-50">{result.country}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-start bg-linear-to-b from-white/5 to-transparent">
        <div>
          <div className="flex items-center gap-1 text-lg font-semibold">
            {currentWeather.location}{" "}
            <MapPin size={14} className="opacity-70" />
          </div>
          <div className="text-6xl font-thin tracking-tighter mt-1">
            {currentWeather.current.temp}°
          </div>
        </div>
        <div className="flex flex-col items-end text-right">
          <currentWeather.current.icon
            size={32}
            className="text-yellow-400 mb-1"
          />
          <div className="text-sm font-medium">
            {currentWeather.current.description}
          </div>
          <div className="text-xs opacity-70 mt-1">
            H:{Math.round(currentWeather.daily.tempMax[0])}° L:
            {Math.round(currentWeather.daily.tempMin[0])}°
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between text-xs font-semibold opacity-60 mb-3 uppercase tracking-wider">
          {currentWeather.hourly.time.slice(0, 5).map((time) => {
            const date = new Date(time);
            const hour = date.getHours();
            const isNow = date.getHours() === new Date().getHours();
            return (
              <span key={time}>
                {isNow
                  ? "Now"
                  : `${hour % 12 || 12}${hour >= 12 ? "PM" : "AM"}`}
              </span>
            );
          })}
        </div>
        <div className="flex justify-between items-center">
          {currentWeather.hourly.time.slice(0, 5).map((time, i) => {
            const info = getWeatherInfo(currentWeather.hourly.code[i], true);
            const Icon = info.icon;
            return (
              <div key={time} className="flex flex-col items-center gap-2">
                <Icon size={20} className="opacity-90" />
                <span className="text-sm font-medium">
                  {Math.round(currentWeather.hourly.temp[i])}°
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="p-2">
        {currentWeather.daily.time.slice(0, 3).map((time, i) => {
          const date = new Date(time);
          const dayName =
            i === 0
              ? "Today"
              : date.toLocaleDateString("en-US", { weekday: "long" });
          const info = getWeatherInfo(currentWeather.daily.code[i]);
          const Icon = info.icon;

          return (
            <div
              key={time}
              className="flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <span className="w-24 font-medium">{dayName}</span>
              <Icon size={18} className="opacity-80" />
              <div className="flex items-center gap-3 w-24 justify-end">
                <span className="opacity-60">
                  {Math.round(currentWeather.daily.tempMin[i])}°
                </span>
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 bg-linear-to-b from-blue-500/20 to-blue-600/20 rounded-full"
                    style={{ left: "10%", right: "10%" }}
                  />
                </div>
                <span className="font-medium">
                  {Math.round(currentWeather.daily.tempMax[i])}°
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="px-4 py-2 border-t border-white/10 text-xs opacity-50 hover:bg-white/5 cursor-pointer transition-colors"
        onClick={openWeatherApp}
      >
        Open Weather
      </div>
    </div>,
    document.body
  );
};
