import React, { useState } from "react";
import {
  MapPin,
  Menu,
  X,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Gauge,
  Sun,
} from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import {
  getWeatherInfo,
  searchLocation,
  fetchWeather,
  WeatherData,
} from "../lib/weatherApi";

const POPULAR_LOCATIONS = [
  { name: "New York", lat: 40.7128, lon: -74.006, country: "USA" },
  { name: "London", lat: 51.5074, lon: -0.1278, country: "UK" },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503, country: "Japan" },
  { name: "Paris", lat: 48.8566, lon: 2.3522, country: "France" },
  { name: "Sydney", lat: -33.8688, lon: 151.2093, country: "Australia" },
];

export const Weather: React.FC = () => {
  const { weather: initialData, loading } = useWeather();
  const [data, setData] = useState<WeatherData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentLocations, setRecentLocations] = useState<any[]>([]);

  // Load recent locations from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("weather_recent_locations");
    if (saved) {
      try {
        setRecentLocations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent locations", e);
      }
    }
  }, []);

  const saveRecentLocation = (loc: any) => {
    const newRecent = [
      loc,
      ...recentLocations.filter(
        (r) => r.name !== loc.name || r.country !== loc.country
      ),
    ].slice(0, 5); // Keep last 5
    setRecentLocations(newRecent);
    localStorage.setItem("weather_recent_locations", JSON.stringify(newRecent));
  };

  React.useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

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
      setData(newWeather);
      setSearchQuery("");
      setSearchResults([]);
      setSidebarOpen(false);
      saveRecentLocation(loc);
    } catch (error) {
      console.error("Failed to fetch weather for selected location", error);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-slate-900 text-white overflow-hidden font-sans select-none">
      {/* Sidebar (Collapsible) */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-[#2C2C2E]/90 backdrop-blur-xl border-r border-white/10 flex flex-col overflow-hidden relative z-20`}
      >
        <div className="p-4">
          <input
            type="text"
            placeholder={isSearching ? "Searching..." : "Search city"}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Mock Saved Locations */}
          {searchQuery.length > 0 ? (
            searchResults.length > 0 ? (
              searchResults.map((result, i) => (
                <div
                  key={i}
                  className="px-4 py-3 hover:bg-white/10 cursor-pointer flex flex-col border-b border-white/5"
                  onClick={() => selectLocation(result)}
                >
                  <span className="font-medium text-sm">{result.name}</span>
                  <span className="text-xs opacity-60">{result.country}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-xs opacity-50 text-center">
                No results found
              </div>
            )
          ) : (
            <>
              {recentLocations.length > 0 && (
                <div className="mb-4">
                  <div className="px-4 py-2 text-xs font-semibold opacity-50 uppercase tracking-wider">
                    Recent
                  </div>
                  {recentLocations.map((loc, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-white/10 cursor-pointer flex justify-between items-center"
                      onClick={() => selectLocation(loc)}
                    >
                      <span className="font-medium text-sm">{loc.name}</span>
                      <span className="text-xs opacity-60">{loc.country}</span>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <div className="px-4 py-2 text-xs font-semibold opacity-50 uppercase tracking-wider">
                  Popular
                </div>
                {POPULAR_LOCATIONS.map((loc, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer flex justify-between items-center"
                    onClick={() => selectLocation(loc)}
                  >
                    <span className="font-medium text-sm">{loc.name}</span>
                    <span className="text-xs opacity-60">{loc.country}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-linear-to-b from-[#1E3A8A] via-[#2563EB] to-[#60A5FA]">
        {/* Background Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] pointer-events-none mix-blend-overlay" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Toolbar */}
        <div className="h-12 flex items-center px-4 justify-between z-10 text-white/90">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="text-sm font-medium flex items-center gap-1 drop-shadow-md">
            <MapPin size={14} /> {data.location}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-4 scrollbar-hide">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center py-8 text-center text-white drop-shadow-lg">
              <h2 className="text-3xl font-medium mb-2">{data.location}</h2>
              <div className="text-9xl font-thin tracking-tighter flex items-start ml-6">
                {data.current.temp}
                <span className="text-5xl mt-4 font-normal">°</span>
              </div>
              <div className="text-2xl font-medium mt-2 opacity-90">
                {data.current.description}
              </div>
              <div className="flex gap-4 mt-2 text-lg font-medium opacity-80">
                <span>H:{Math.round(data.daily.tempMax[0])}°</span>
                <span>L:{Math.round(data.daily.tempMin[0])}°</span>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="text-xs font-semibold opacity-70 mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <Sun size={10} />
                </div>
                Hourly Forecast
              </div>
              <div className="flex overflow-x-auto gap-8 pb-2 scrollbar-hide">
                {data.hourly.time.slice(0, 24).map((time, i) => {
                  const date = new Date(time);
                  const hour = date.getHours();
                  const isNow = i === 0;
                  const info = getWeatherInfo(
                    data.hourly.code[i],
                    hour > 6 && hour < 20
                  );
                  const Icon = info.icon;

                  return (
                    <div
                      key={time}
                      className="flex flex-col items-center gap-3 min-w-[50px]"
                    >
                      <span className="text-sm font-medium opacity-90">
                        {isNow
                          ? "Now"
                          : `${hour % 12 || 12}${hour >= 12 ? "PM" : "AM"}`}
                      </span>
                      <Icon size={32} className="drop-shadow-md" />
                      <span className="text-xl font-semibold">
                        {Math.round(data.hourly.temp[i])}°
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 10-Day Forecast (Spans 2 cols on large) */}
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl h-full">
                <div className="text-xs font-semibold opacity-70 mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Sun size={10} />
                  </div>
                  10-Day Forecast
                </div>
                <div className="flex flex-col gap-1">
                  {data.daily.time.map((time, i) => {
                    const date = new Date(time);
                    const dayName =
                      i === 0
                        ? "Today"
                        : date.toLocaleDateString("en-US", {
                            weekday: "short",
                          });
                    const info = getWeatherInfo(data.daily.code[i]);
                    const Icon = info.icon;
                    const min = Math.round(data.daily.tempMin[i]);
                    const max = Math.round(data.daily.tempMax[i]);
                    // Simple bar visualization
                    const range = 40; // Assumed temp range for bar
                    const left = ((min - 30) / range) * 100; // Mock calculation
                    const width = ((max - min) / range) * 100;

                    return (
                      <div
                        key={time}
                        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                      >
                        <span className="w-12 font-medium text-base">
                          {dayName}
                        </span>
                        <div className="flex flex-col items-center w-10">
                          <Icon size={24} className="drop-shadow-sm" />
                        </div>
                        <div className="flex items-center gap-4 flex-1 px-4">
                          <span className="text-base opacity-70 w-8 text-right">
                            {min}°
                          </span>
                          <div className="flex-1 h-1.5 bg-black/20 rounded-full relative overflow-hidden">
                            <div
                              className="absolute h-full bg-linear-to-r from-blue-300 to-yellow-300 rounded-full opacity-90"
                              style={{
                                left: `${Math.max(0, Math.min(100, left))}%`,
                                width: `${Math.max(5, Math.min(100, width))}%`,
                              }}
                            />
                          </div>
                          <span className="text-base font-semibold w-8 text-right">
                            {max}°
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Air Quality */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col">
                <div className="text-xs font-semibold opacity-70 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Wind size={10} />
                  </div>
                  Air Quality
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl font-semibold">130</div>
                    <div className="text-sm font-medium mt-1">
                      Moderately Polluted
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 w-full bg-linear-to-r from-green-400 via-yellow-400 to-red-500 rounded-full" />
                    <div className="text-xs opacity-70 mt-2 leading-relaxed">
                      Air quality index is 130, similar to yesterday at about
                      this time.
                    </div>
                  </div>
                </div>
              </div>

              {/* UV Index */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col">
                <div className="text-xs font-semibold opacity-70 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Sun size={10} />
                  </div>
                  UV Index
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl font-semibold">
                      {Math.round(data.daily.uvIndex[0])}
                    </div>
                    <div className="text-sm font-medium mt-1">Moderate</div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 w-full bg-linear-to-r from-green-400 to-purple-500 rounded-full relative">
                      <div
                        className="absolute w-3 h-3 bg-white rounded-full top-1/2 -translate-y-1/2 shadow-md border border-black/10"
                        style={{
                          left: `${(data.daily.uvIndex[0] / 12) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs opacity-70 mt-2 leading-relaxed">
                      Use sun protection until 4PM.
                    </div>
                  </div>
                </div>
              </div>

              {/* Wind */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl aspect-square">
                <div className="text-xs font-semibold opacity-70 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Wind size={10} />
                  </div>
                  Wind
                </div>
                <div className="flex items-center justify-center h-full relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border border-white/20 relative flex items-center justify-center bg-black/10">
                      <div className="absolute top-1 text-[10px] font-bold opacity-70">
                        N
                      </div>
                      <div className="absolute bottom-1 text-[10px] font-bold opacity-70">
                        S
                      </div>
                      <div className="absolute left-1 text-[10px] font-bold opacity-70">
                        W
                      </div>
                      <div className="absolute right-1 text-[10px] font-bold opacity-70">
                        E
                      </div>
                      {/* Needle */}
                      <div
                        className="w-1.5 h-16 bg-white shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-bottom transition-transform duration-1000"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${data.current.windDirection}deg)`,
                        }}
                      >
                        <div className="w-3 h-3 bg-white rounded-full absolute bottom-0 left-1/2 -translate-x-1/2" />
                        <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-8 border-b-red-500 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center z-10 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10">
                    <div className="text-xl font-bold">
                      {Math.round(data.current.windSpeed)}
                    </div>
                    <div className="text-[10px] opacity-80">km/h</div>
                  </div>
                </div>
              </div>

              {/* Sunset */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl aspect-square flex flex-col">
                <div className="text-xs font-semibold opacity-70 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Sun size={10} />
                  </div>
                  Sunset
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="text-3xl font-medium">
                    {new Date(data.daily.sunset[0]).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    Sunrise:{" "}
                    {new Date(data.daily.sunrise[1]).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="w-full h-16 mt-4 relative overflow-hidden">
                    <div className="absolute bottom-0 w-full h-px bg-white/40" />
                    <div className="absolute bottom-0 w-full h-12 border-t-2 border-white/60 rounded-t-full opacity-50" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-300 rounded-full shadow-[0_0_30px_rgba(253,224,71,0.8)]" />
                  </div>
                </div>
              </div>

              {/* Feels Like */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl aspect-square flex flex-col">
                <div className="text-xs font-semibold opacity-70 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Thermometer size={10} />
                  </div>
                  Feels Like
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-4xl font-semibold">
                    {data.current.temp}°
                  </div>
                  <div className="text-xs opacity-70 leading-relaxed">
                    Similar to the actual temperature.
                  </div>
                </div>
              </div>

              {/* Humidity */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl aspect-square flex flex-col">
                <div className="text-xs font-semibold opacity-70 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Droplets size={10} />
                  </div>
                  Humidity
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-4xl font-semibold">
                    {data.current.humidity}%
                  </div>
                  <div className="text-xs opacity-70 leading-relaxed">
                    The dew point is {Math.round(data.current.temp - 5)}° right
                    now.
                  </div>
                </div>
              </div>

              {/* Visibility */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl aspect-square flex flex-col">
                <div className="text-xs font-semibold opacity-70 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Eye size={10} />
                  </div>
                  Visibility
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-4xl font-semibold">24 km</div>
                  <div className="text-xs opacity-70 leading-relaxed">
                    Perfectly clear view.
                  </div>
                </div>
              </div>

              {/* Pressure */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl aspect-square flex flex-col">
                <div className="text-xs font-semibold opacity-70 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Gauge size={10} />
                  </div>
                  Pressure
                </div>
                <div className="flex-1 flex flex-col justify-center items-center relative">
                  <div className="w-24 h-24 rounded-full border-[6px] border-white/10 border-t-white/90 rotate-[135deg]" />
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold">1012</span>
                    <span className="text-xs opacity-70">hPa</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-xs opacity-50 pb-8 pt-4">
              Weather for {data.location} • Open-Meteo Data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
