import React, { useState, useEffect } from "react";
import {
  Search,
  Navigation,
  Map as MapIcon,
  Info,
  Locate,
  Clock,
} from "lucide-react";
import { usePermission } from "../context/PermissionContext";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// Dynamically import Map to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import("../components/ui/Map"), {
  ssr: false,
});

export const Maps: React.FC = () => {
  const t = useTranslations("Maps");
  const { requestPermission } = usePermission();
  const [searchQuery, setSearchQuery] = useState("");
  // Default to Lucknow
  const [coords, setCoords] = useState<[number, number]>([26.8467, 80.9462]);

  const [recents, setRecents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with Lucknow
  useEffect(() => {
    // Initial load is already set by default state
  }, []);

  const addToRecents = (loc: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((item) => item !== loc);
      return [loc, ...filtered].slice(0, 10);
    });
  };

  const geocode = async (query: string) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoords([parseFloat(lat), parseFloat(lon)]);
        // Keep the user's query in the search bar, but update our internal name if needed
        // setCurrentLocationName(display_name);
        addToRecents(query);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Error searching location");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      geocode(searchQuery);
    }
  };

  const handleCurrentLocation = async () => {
    if ("geolocation" in navigator) {
      const allowed = await requestPermission(
        t("Permission.AppName"),
        <Navigation size={24} className="text-blue-500" />,
        t("Permission.Title"),
        t("Permission.Reason"),
        "geolocation"
      );

      if (!allowed) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoords([latitude, longitude]);
          // Optional: Reverse geocode to get name
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            if (data && data.display_name) {
              setSearchQuery(data.display_name);
              addToRecents(data.display_name);
            } else {
              setSearchQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } catch {
            setSearchQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(t("Permission.Error"));
        }
      );
    } else {
      alert(t("Permission.NotSupported"));
    }
  };

  const loadLocation = (loc: string) => {
    setSearchQuery(loc);
    geocode(loc);
  };

  return (
    <div className="flex h-full bg-[#f5f5f7] dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans relative overflow-hidden">
      {/* Sidebar */}
      <div className="absolute top-4 left-4 w-80 bg-white/90 dark:bg-[#2b2b2b]/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-black/10 z-50 flex flex-col max-h-[calc(100%-32px)]">
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
              placeholder={t("SearchPlaceholder")}
              aria-label={t("SearchPlaceholder")}
              className="w-full bg-gray-100 dark:bg-black/20 border-none rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {loading && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2 mt-2">
            {t("Sidebar.Favorites")}
          </h3>
          <div className="space-y-1">
            <div
              onClick={() => loadLocation("Lucknow, Uttar Pradesh")}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  loadLocation("Lucknow, Uttar Pradesh");
                }
              }}
              aria-label="Go to Home location"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Navigation size={16} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {t("Locations.Home")}
                </span>
                <span className="text-xs text-gray-500">Lucknow</span>
              </div>
            </div>
            <div
              onClick={() => loadLocation("Florida, USA")}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  loadLocation("Florida, USA");
                }
              }}
              aria-label="Go to Work location"
            >
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                <MapIcon size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {t("Locations.Work")}
                </span>
                <span className="text-xs text-gray-500">Florida</span>
              </div>
            </div>
          </div>

          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2 mt-4">
            {t("Sidebar.Recent")}
          </h3>
          <div className="space-y-1">
            {recents.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                {t("Sidebar.NoRecentSearches")}
              </div>
            )}
            {recents.map((loc) => (
              <div
                key={loc}
                onClick={() => loadLocation(loc)}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    loadLocation(loc);
                  }
                }}
                aria-label={`Go to recent location: ${loc}`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                  <Clock size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate w-48">
                    {loc}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t("Sidebar.RecentLabel")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="w-full h-full bg-[#e5e3df] dark:bg-[#242f3e] relative z-0">
        <LeafletMap center={coords} zoom={13} />

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
          <button
            className="w-10 h-10 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-md flex items-center justify-center text-blue-500 hover:bg-gray-50"
            title={t("Controls.SwitchToMap")}
          >
            <MapIcon size={20} />
          </button>
          <button
            onClick={handleCurrentLocation}
            className="w-10 h-10 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-md flex items-center justify-center text-gray-500 hover:bg-gray-50"
            title={t("Controls.CurrentLocation")}
          >
            <Locate size={20} />
          </button>
          <button
            className="w-10 h-10 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-md flex items-center justify-center text-gray-500 hover:bg-gray-50"
            aria-label={t("Controls.MapInfo")}
          >
            <Info size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
