import { NextRequest, NextResponse } from "next/server";

interface GeoResponse {
  lat: number;
  lon: number;
  name: string;
}

const DEFAULT_LOCATION: GeoResponse = {
  lat: 28.6139,
  lon: 77.209,
  name: "New Delhi",
};

function isPrivateIp(ip: string): boolean {
  if (!ip || ip === "::1" || ip === "127.0.0.1") return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  if (ip.startsWith("fc00:") || ip.startsWith("fe80:")) return true;
  return false;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Check Vercel Geo headers (provided on Vercel deployment)
    const vercelLat = request.headers.get("x-vercel-ip-latitude");
    const vercelLon = request.headers.get("x-vercel-ip-longitude");
    const vercelCity = request.headers.get("x-vercel-ip-city");

    if (vercelLat && vercelLon) {
      const lat = parseFloat(vercelLat);
      const lon = parseFloat(vercelLon);
      const name = vercelCity ? decodeURIComponent(vercelCity) : "Current Location";

      if (!isNaN(lat) && !isNaN(lon)) {
        return NextResponse.json({ lat, lon, name });
      }
    }

    // 2. Extract Client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "";

    const isLocal = isPrivateIp(clientIp);

    // 3. Query primary IP geolocation service (ipwho.is)
    try {
      const url = isLocal ? "https://ipwho.is/" : `https://ipwho.is/${encodeURIComponent(clientIp)}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "chirag.rocks-weather/1.0" },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && typeof data.latitude === "number" && typeof data.longitude === "number") {
          return NextResponse.json({
            lat: data.latitude,
            lon: data.longitude,
            name: data.city || data.region || data.country || "Current Location",
          });
        }
      }
    } catch (ipwhoError) {
      console.warn("ipwho.is request failed:", ipwhoError);
    }

    // 4. Secondary fallback (geojs.io)
    try {
      const url = isLocal
        ? "https://get.geojs.io/v1/ip/geo.json"
        : `https://get.geojs.io/v1/ip/geo/${encodeURIComponent(clientIp)}.json`;
      const res = await fetch(url, {
        headers: { "User-Agent": "chirag.rocks-weather/1.0" },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
          return NextResponse.json({
            lat,
            lon,
            name: data.city || data.region || data.country || "Current Location",
          });
        }
      }
    } catch (geojsError) {
      console.warn("geojs.io request failed:", geojsError);
    }

    // 5. Default location fallback
    return NextResponse.json(DEFAULT_LOCATION);
  } catch (error) {
    console.error("Location API error:", error);
    return NextResponse.json(DEFAULT_LOCATION);
  }
}
