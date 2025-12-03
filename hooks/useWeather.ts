import { useState, useEffect } from "react";
import { fetchWeather, getUserLocation, WeatherData } from "../lib/weatherApi";
import { usePermission } from "../context/PermissionContext";

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { requestPermission } = usePermission();

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);

        // Ask for permission first
        const allowed = await requestPermission(
          "Weather",
          "⛅",
          "Location",
          "Weather needs access to your location to show local weather conditions.",
          "geolocation"
        );

        if (!allowed) {
          // Fallback to default location (New Delhi) if denied
          const data = await fetchWeather(28.6139, 77.209, "New Delhi");
          setWeather(data);
          setLoading(false);
          return;
        }

        const location = await getUserLocation();
        const data = await fetchWeather(
          location.lat,
          location.lon,
          location.name
        );
        setWeather(data);
      } catch (err: any) {
        console.error(err);

        // If it's a rate limit error, don't try fallback
        if (err.message?.includes("Rate limit")) {
          setError(err.message);
          setLoading(false);
          return;
        }

        // Fallback to default location (New Delhi)
        try {
          const data = await fetchWeather(28.6139, 77.209, "New Delhi");
          setWeather(data);
        } catch (fallbackErr: any) {
          setError(fallbackErr.message || "Failed to load weather data");
        }
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [requestPermission]);

  return { weather, loading, error };
};
