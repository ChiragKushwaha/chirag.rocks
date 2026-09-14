import { useQuery } from "@tanstack/react-query";
import { fetchWeather, getUserLocation } from "../lib/weatherApi";

export const useWeather = () => {
  const {
    data: weather,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
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
