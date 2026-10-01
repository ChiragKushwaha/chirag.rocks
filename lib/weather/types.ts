import { ElementType } from "react";

export interface WeatherData {
  current: {
    temp: number;
    code: number;
    windSpeed: number;
    windDirection: number;
    humidity: number;
    isDay: boolean;
    description: string;
    icon: ElementType;
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

export interface UserCoordinates {
  lat: number;
  lon: number;
  name: string;
}

export interface LocationSearchResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
}
