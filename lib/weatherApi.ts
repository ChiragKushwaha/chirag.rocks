import {
  SunIcon,
  CloudIcon,
  RainIcon,
  MoonIcon,
  PartlyCloudyIcon,
} from "../components/icons/WeatherIcons";
import { CloudLightning, CloudFog, CloudSnow } from "lucide-react";

export interface WeatherData {
  current: {
    temp: number;
    code: number;
    windSpeed: number;
    windDirection: number;
    humidity: number;
    isDay: boolean;
    description: string;
    icon: React.ElementType;
  };
  hourly: {
    time: string[];
    temp: number[];
    code: number[];
  };
  daily: {
    time: string[];
    code: number[];
    tempMax: number[];
    tempMin: number[];
    sunrise: string[];
    sunset: string[];
    uvIndex: number[];
    rainSum: number[];
  };
  location: string;
}

// WMO Weather interpretation codes (WW)
export const getWeatherInfo = (code: number, isDay: boolean = true) => {
  const icons: Record<number, React.ElementType> = {
    0: isDay ? SunIcon : MoonIcon, // Clear sky
    1: isDay ? SunIcon : MoonIcon, // Mainly clear
    2: isDay ? PartlyCloudyIcon : CloudIcon, // Partly cloudy
    3: CloudIcon, // Overcast
    45: CloudFog, // Fog
    48: CloudFog, // Depositing rime fog
    51: RainIcon, // Drizzle: Light
    53: RainIcon, // Drizzle: Moderate
    55: RainIcon, // Drizzle: Dense
    61: RainIcon, // Rain: Slight
    63: RainIcon, // Rain: Moderate
    65: RainIcon, // Rain: Heavy
    71: CloudSnow, // Snow fall: Slight
    73: CloudSnow, // Snow fall: Moderate
    75: CloudSnow, // Snow fall: Heavy
    77: CloudSnow, // Snow grains
    80: RainIcon, // Rain showers: Slight
    81: RainIcon, // Rain showers: Moderate
    82: RainIcon, // Rain showers: Violent
    85: CloudSnow, // Snow showers slight
    86: CloudSnow, // Snow showers heavy
    95: CloudLightning, // Thunderstorm: Slight or moderate
    96: CloudLightning, // Thunderstorm with slight hail
    99: CloudLightning, // Thunderstorm with heavy hail
  };

  const descriptions: Record<number, string> = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    72: "Snow",
    73: "Snow",
    75: "Heavy Snow",
    77: "Snow Grains",
    80: "Light Showers",
    81: "Showers",
    82: "Heavy Showers",
    85: "Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  };

  return {
    icon: icons[code] || CloudIcon,
    description: descriptions[code] || "Unknown",
  };
};

export const getUserLocation = (): Promise<{
  lat: number;
  lon: number;
  name: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding to get city name
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await res.json();
            resolve({
              lat: latitude,
              lon: longitude,
              name: data.city || data.locality || "Unknown Location",
            });
          } catch {
            // Fallback if reverse geocoding fails
            resolve({
              lat: latitude,
              lon: longitude,
              name: "Current Location",
            });
          }
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

export const fetchWeather = async (
  lat: number,
  lon: number,
  locationName: string
): Promise<WeatherData> => {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current:
        "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,is_day",
      hourly: "temperature_2m,weather_code",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum",
      timezone: "auto",
    });

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`
    );

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw new Error(`Weather API error: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data.current) {
      throw new Error("Invalid weather data received");
    }

    const currentInfo = getWeatherInfo(
      data.current.weather_code,
      data.current.is_day === 1
    );

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
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    throw error;
  }
};

export const searchLocation = async (
  query: string
): Promise<{ name: string; lat: number; lon: number; country: string }[]> => {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=5&language=en&format=json`
    );
    const data = await res.json();

    if (!data.results) return [];

    return data.results.map(
      (item: {
        name: string;
        latitude: number;
        longitude: number;
        country: string;
      }) => ({
        name: item.name,
        lat: item.latitude,
        lon: item.longitude,
        country: item.country,
      })
    );
  } catch (error) {
    console.error("Failed to search location:", error);
    return [];
  }
};
