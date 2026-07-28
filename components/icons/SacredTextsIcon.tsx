import React from "react";

interface SacredTextsIconProps {
  size?: number;
  className?: string;
}

/**
 * Sacred Texts — the world's sacred literature, beautifully read.
 * A golden open book haloed by radiant light on a deep, mystical field.
 */
export const SacredTextsIcon: React.FC<SacredTextsIconProps> = ({
  size = 112,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-[22%] overflow-hidden shadow-2xl bg-linear-to-b from-[#3a2a63] via-[#241748] to-[#0e0a1f] flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="st-glow" cx="50%" cy="30%" r="44%">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#f7c34b" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#f7c34b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="st-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe7a0" />
            <stop offset="55%" stopColor="#f6c453" />
            <stop offset="100%" stopColor="#d99a2b" />
          </linearGradient>
        </defs>

        {/* Divine halo */}
        <circle cx="50" cy="30" r="30" fill="url(#st-glow)" />

        {/* Sparkle above the book */}
        <path
          d="M50 8 L52.4 17.6 L62 20 L52.4 22.4 L50 32 L47.6 22.4 L38 20 L47.6 17.6 Z"
          fill="#fff6da"
          opacity="0.95"
        />

        {/* Open book */}
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M50 44 C41 38 30 36 20 38 L20 74 C30 72 41 74 50 80 Z"
            fill="url(#st-gold)"
            stroke="#b9791f"
            strokeWidth="1.4"
          />
          <path
            d="M50 44 C59 38 70 36 80 38 L80 74 C70 72 59 74 50 80 Z"
            fill="url(#st-gold)"
            stroke="#b9791f"
            strokeWidth="1.4"
          />
          {/* Spine */}
          <path d="M50 44 L50 80" stroke="#a9691a" strokeWidth="1.6" />
          {/* Text lines */}
          <g stroke="#9a5f16" strokeWidth="1.5" opacity="0.7">
            <path d="M27 47 L44 50" />
            <path d="M27 54 L44 57" />
            <path d="M27 61 L44 64" />
            <path d="M56 50 L73 47" />
            <path d="M56 57 L73 54" />
            <path d="M56 64 L73 61" />
          </g>
        </g>
      </svg>

      {/* Gloss */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/15 to-transparent" />
    </div>
  );
};
