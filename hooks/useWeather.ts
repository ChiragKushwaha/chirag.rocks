import { useQuery } from "@tanstack/react-query";
import { fetchWeather, getUserLocation } from "../lib/weatherApi";
import { usePermission } from "../context/PermissionContext";

export const useWeather = () => {
  const { requestPermission } = usePermission();

  const {
    data: weather,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      // 1. Ask for permission (or check status)
      // Note: requestPermission might resolve immediately if already granted.
      // Ideally we would split this into two steps: check permission -> if granted, fetch user loc.
      // If not granted or prompt needed -> wait.
      // But for simplicity in this port:

      const allowed = await requestPermission(
        "Weather",
        "⛅",
        "Location",
        "Weather needs access to your location to show local weather conditions.",
        "geolocation"
      );

      if (!allowed) {
        // Return default location data
        return fetchWeather(28.6139, 77.209, "New Delhi");
      }

      const location = await getUserLocation();
      return fetchWeather(location.lat, location.lon, location.name);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Simplified error handling surface for the component
  const error =
    queryError instanceof Error
      ? queryError.message
      : queryError
      ? "Unknown error"
      : null;

  return { weather: weather || null, loading, error };
};
