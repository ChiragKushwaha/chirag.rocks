import { apiClient } from "../apiClient";
import { WeatherData, LocationSearchResult } from "./types";
import { getWeatherInfo } from "./weatherCodes";

interface OpenMeteoForecastResponse {
  current?: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    relative_humidity_2m: number;
    is_day: number;
  };
  hourly: { time: string[]; temperature_2m: number[]; weather_code: number[] };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    rain_sum: number[];
  };
}

export const fetchWeather = async (
  lat: number,
  lon: number,
  locationName: string
): Promise<WeatherData> => {
  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: lat,
    longitude: lon,
    current:
      "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,is_day",
    hourly: "temperature_2m,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum",
    timezone: "auto",
  };

  const { data } = await apiClient.get<OpenMeteoForecastResponse>(url, { params });
  if (!data.current) throw new Error("Invalid weather data received");

  const currentInfo = getWeatherInfo(data.current.weather_code, data.current.is_day === 1);

  return {
    current: {
      temp: Math.round(data.current.temperature_2m),
      code: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      humidity: data.current.relative_humidity_2m,
      isDay: data.current.is_day === 1,
      description: currentInfo.description,
      icon: currentInfo.icon,
    },
    hourly: {
      time: data.hourly.time,
      temp: data.hourly.temperature_2m,
      code: data.hourly.weather_code,
    },
    daily: {
      time: data.daily.time,
      code: data.daily.weather_code,
      tempMax: data.daily.temperature_2m_max,
      tempMin: data.daily.temperature_2m_min,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
      uvIndex: data.daily.uv_index_max,
      rainSum: data.daily.rain_sum,
    },
    location: locationName,
  };
};

export const searchLocation = async (query: string): Promise<LocationSearchResult[]> => {
  const url = "https://geocoding-api.open-meteo.com/v1/search";
  const params = { name: query, count: 5, language: "en", format: "json" };
  const { data } = await apiClient.get<{ results?: Array<{ name: string; latitude: number; longitude: number; country: string }> }>(url, { params });
  return (data.results || []).map((item) => ({
    name: item.name,
    lat: item.latitude,
    lon: item.longitude,
    country: item.country,
  }));
};
