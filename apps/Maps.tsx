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
import { useQuery } from "@tanstack/react-query";

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

  // We use this state to trigger the query
  const [submittedQuery, setSubmittedQuery] = useState("");

  const [recents, setRecents] = useState<string[]>([]);

  // Search Query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["maps", "search", submittedQuery],
    queryFn: async () => {
      if (!submittedQuery) return null;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          submittedQuery
        )}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    enabled: !!submittedQuery,
    staleTime: Infinity, // Locations rarely change
  });

  const addToRecents = (loc: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((item) => item !== loc);
      return [loc, ...filtered].slice(0, 10);
    });
  };

  // Effect to handle search results
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      const { lat, lon } = searchResults[0];

      // eslint-disable-next-line
      setCoords([parseFloat(lat), parseFloat(lon)]);
      addToRecents(submittedQuery);
    } else if (searchResults && searchResults.length === 0) {
      alert("Location not found");
    }
  }, [searchResults, submittedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery);
    }
  };

  // State for reverse geocoding trigger
  const [reverseCoords, setReverseCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const { data: reverseData } = useQuery({
    queryKey: ["maps", "reverse", reverseCoords?.lat, reverseCoords?.lon],
    queryFn: async () => {
      if (!reverseCoords) return null;
      const { lat, lon } = reverseCoords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      if (!res.ok) throw new Error("Failed to fetch address");
      return res.json();
    },
    enabled: !!reverseCoords,
    staleTime: Infinity,
  });

  // Effect to update search query when reverse geocoding succeeds
  useEffect(() => {
    if (reverseData) {
      if (reverseData.display_name) {
        // eslint-disable-next-line
        setSearchQuery(reverseData.display_name);
        addToRecents(reverseData.display_name);
      } else if (reverseCoords) {
        setSearchQuery(
          `${reverseCoords.lat.toFixed(4)}, ${reverseCoords.lon.toFixed(4)}`
        );
      }
    }
  }, [reverseData, reverseCoords]);

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
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords([latitude, longitude]);
          // Trigger reverse geocoding query
          setReverseCoords({ lat: latitude, lon: longitude });
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
    setSubmittedQuery(loc);
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
            {isSearching && (
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
