import React from "react";

interface ToonflixIconProps {
  size?: number;
  className?: string;
}

/**
 * t00nflix / TOONFLIX — stream comics, manga & toons.
 * A bold streaming-style "T" in cinematic red on a near-black backdrop.
 */
export const ToonflixIcon: React.FC<ToonflixIconProps> = ({
  size = 112,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-[22%] overflow-hidden shadow-2xl bg-linear-to-b from-[#1c1c1c] via-[#0e0e0e] to-[#000000] flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tf-red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff3b3b" />
            <stop offset="55%" stopColor="#e50914" />
            <stop offset="100%" stopColor="#9b0510" />
          </linearGradient>
          <filter id="tf-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bold "T" built from two bars for crisp, font-free rendering */}
        <g fill="url(#tf-red)" filter="url(#tf-glow)">
          <rect x="24" y="24" width="52" height="15" rx="3.5" />
          <rect x="42.5" y="30" width="15" height="46" rx="3.5" />
        </g>
      </svg>

      {/* Gloss */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
    </div>
  );
};
