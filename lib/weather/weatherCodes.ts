import React from "react";
import {
  SunIcon,
  CloudIcon,
  RainIcon,
  MoonIcon,
  PartlyCloudyIcon,
} from "../../components/icons/WeatherIcons";
import { CloudLightning, CloudFog, CloudSnow } from "lucide-react";

export interface WeatherInfo {
  icon: React.ElementType;
  description: string;
}

const WEATHER_ICONS: Record<number, (isDay: boolean) => React.ElementType> = {
  0: (isDay) => (isDay ? SunIcon : MoonIcon),
  1: (isDay) => (isDay ? SunIcon : MoonIcon),
  2: (isDay) => (isDay ? PartlyCloudyIcon : CloudIcon),
  3: () => CloudIcon,
  45: () => CloudFog,
  48: () => CloudFog,
  51: () => RainIcon,
  53: () => RainIcon,
  55: () => RainIcon,
  61: () => RainIcon,
  63: () => RainIcon,
  65: () => RainIcon,
  71: () => CloudSnow,
  73: () => CloudSnow,
  75: () => CloudSnow,
  77: () => CloudSnow,
  80: () => RainIcon,
  81: () => RainIcon,
  82: () => RainIcon,
  85: () => CloudSnow,
  86: () => CloudSnow,
  95: () => CloudLightning,
  96: () => CloudLightning,
  99: () => CloudLightning,
};

const WEATHER_DESCRIPTIONS: Record<number, string> = {
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

export const getWeatherInfo = (code: number, isDay: boolean = true): WeatherInfo => {
  const iconFactory = WEATHER_ICONS[code];
  const icon = iconFactory ? iconFactory(isDay) : CloudIcon;
  const description = WEATHER_DESCRIPTIONS[code] || "Unknown";
  return { icon, description };
};
