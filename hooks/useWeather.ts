import { useState, useEffect } from "react";
import { fetchWeather, getUserLocation, WeatherData } from "../lib/weatherApi";

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
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
  }, []);

  return { weather, loading, error };
};
