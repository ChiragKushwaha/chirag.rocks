"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface MapProps {
  center: [number, number];
  zoom?: number;
  className?: string;
}

// Helper component to update map view when props change
const MapUpdater: React.FC<{
  center: [number, number];
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();

  // Fly to center when coords change
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
    });
  }, [center, zoom, map]);

  // Handle Geocoding if query is provided and it differs from current center context
  // NOTE: In a real app, we usually geocode in the parent and pass coords down.
  // But for this drop-in replacement, we might want to handle it here or in parent.
  // Ideally, the parent should handle geocoding to keep this component dumb.
  // We'll trust the parent passes the correct 'center'.

  return null;
};

const Map: React.FC<MapProps> = ({
  center,
  zoom = 13,
  className = "w-full h-full",
}) => {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} />
        <MapUpdater center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
};

export default Map;
