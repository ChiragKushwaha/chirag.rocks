import React from "react";
import { Sun, Cloud } from "lucide-react";

interface WeatherIconProps {
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  size = 112,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-[22%] overflow-hidden shadow-2xl bg-linear-to-b from-[#29B2DD] to-[#33AADD] ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Sun */}
      <div className="absolute top-[10%] right-[10%] text-yellow-300 drop-shadow-lg animate-pulse-slow">
        <Sun size={size * 0.4} fill="currentColor" />
      </div>

      {/* Cloud */}
      <div className="absolute bottom-[15%] left-[10%] text-white/90 drop-shadow-md">
        <Cloud size={size * 0.5} fill="currentColor" />
      </div>

      {/* Gloss Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent pointer-events-none" />
    </div>
  );
};
