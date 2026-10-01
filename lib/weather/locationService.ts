import { apiClient } from "../apiClient";
import { UserCoordinates } from "./types";

interface LocationApiResponse {
  lat?: number;
  lon?: number;
  name?: string;
}

interface IpWhoIsResponse {
  success?: boolean;
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  country?: string;
}

export const getUserLocation = async (): Promise<UserCoordinates> => {
  // 1. Internal API route
  try {
    const { data } = await apiClient.get<LocationApiResponse>("/api/location");
    if (typeof data.lat === "number" && typeof data.lon === "number") {
      return {
        lat: data.lat,
        lon: data.lon,
        name: data.name || "Current Location",
      };
    }
  } catch (error) {
    console.warn("[locationService] /api/location lookup failed:", error);
  }

  // 2. Direct fallback via ipwho.is
  try {
    const { data } = await apiClient.get<IpWhoIsResponse>("https://ipwho.is/");
    if (
      data.success &&
      typeof data.latitude === "number" &&
      typeof data.longitude === "number"
    ) {
      return {
        lat: data.latitude,
        lon: data.longitude,
        name: data.city || data.region || data.country || "Current Location",
      };
    }
  } catch (error) {
    console.warn("[locationService] ipwho.is lookup failed:", error);
  }

  // 3. Default fallback location (New Delhi)
  return {
    lat: 28.6139,
    lon: 77.209,
    name: "New Delhi",
  };
};
