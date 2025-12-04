import React from "react";
import {
  Search,
  Navigation,
  Map as MapIcon,
  Info,
  Locate,
  Clock,
} from "lucide-react";
import { usePermission } from "../context/PermissionContext";

export const Maps: React.FC = () => {
  const { requestPermission } = usePermission();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentLocation, setCurrentLocation] = React.useState(
    "Lucknow, Uttar Pradesh"
  );
  const [mapType, setMapType] = React.useState<"m" | "k">("m"); // m = standard, k = satellite
  const [recents, setRecents] = React.useState<string[]>([]);

  const addToRecents = (loc: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((item) => item !== loc);
      return [loc, ...filtered].slice(0, 10);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentLocation(searchQuery);
      addToRecents(searchQuery);
    }
  };

  const handleCurrentLocation = async () => {
    if ("geolocation" in navigator) {
      const allowed = await requestPermission(
        "Maps",
        <Navigation size={24} className="text-blue-500" />,
        "Location",
        "Maps needs access to your location to show where you are.",
        "geolocation"
      );

      if (!allowed) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locDisplay = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          // Use coordinates for the map
          setCurrentLocation(`${latitude},${longitude}`);
          // Update search bar text for clarity
          setSearchQuery(locDisplay);
          addToRecents(locDisplay);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Could not get your location. Please ensure location services are enabled."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const loadLocation = (loc: string) => {
    setCurrentLocation(loc);
    setSearchQuery(loc);
    addToRecents(loc);
  };

  // Construct Google Maps Embed URL
  // q = query
  // t = map type (m=map, k=satellite)
  // z = zoom
  // output = embed
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    currentLocation
  )}&t=${mapType}&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="flex h-full bg-[#f5f5f7] dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans relative overflow-hidden">
      {/* Sidebar */}
      <div className="absolute top-4 left-4 w-80 bg-white/90 dark:bg-[#2b2b2b]/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-black/10 z-10 flex flex-col max-h-[calc(100%-32px)]">
        <div className="p-3 border-b border-gray-200 dark:border-black/10">
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Maps"
              aria-label="Search Maps"
              className="w-full bg-gray-100 dark:bg-black/20 border-none rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2 mt-2">
            FAVORITES
          </h3>
          <div className="space-y-1">
            <div
              onClick={() => loadLocation("Lucknow, Uttar Pradesh")}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Navigation size={16} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Home</span>
                <span className="text-xs text-gray-500">Lucknow</span>
              </div>
            </div>
            <div
              onClick={() => loadLocation("Florida, USA")}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                <MapIcon size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Work</span>
                <span className="text-xs text-gray-500">Florida</span>
              </div>
            </div>
          </div>

          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2 mt-4">
            RECENT
          </h3>
          <div className="space-y-1">
            {recents.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                No recent searches
              </div>
            )}
            {recents.map((loc) => (
              <div
                key={loc}
                onClick={() => loadLocation(loc)}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                  <Clock size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate w-48">
                    {loc}
                  </span>
                  <span className="text-xs text-gray-500">Recent</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="w-full h-full bg-[#e5e3df] dark:bg-[#242f3e] relative">
        <iframe
          src={mapUrl}
          className="w-full h-full border-none"
          title="Google Maps"
          loading="lazy"
        />

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setMapType(mapType === "m" ? "k" : "m")}
            className="w-10 h-10 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-md flex items-center justify-center text-blue-500 hover:bg-gray-50"
            title={mapType === "m" ? "Switch to Satellite" : "Switch to Map"}
          >
            {mapType === "m" ? <MapIcon size={20} /> : <Navigation size={20} />}
          </button>
          <button
            onClick={handleCurrentLocation}
            className="w-10 h-10 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-md flex items-center justify-center text-gray-500 hover:bg-gray-50"
            title="Current Location"
          >
            <Locate size={20} />
          </button>
          <button className="w-10 h-10 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-md flex items-center justify-center text-gray-500 hover:bg-gray-50">
            <Info size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
