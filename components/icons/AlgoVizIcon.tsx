import React from "react";

interface AlgoVizIconProps {
  size?: number;
  className?: string;
}

/**
 * Official AlgoViz "Merlin" logo (from https://alg0.vercel.app/icon.svg).
 */
export const AlgoVizIcon: React.FC<AlgoVizIconProps> = ({
  size = 112,
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-[22%] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="64" height="64" rx="14" fill="#e8dec6" />
        {/* face */}
        <circle cx="32" cy="39" r="12.5" fill="#f2d3b8" />
        {/* beard */}
        <path
          d="M20.5 38 Q21.5 55 32 57 Q42.5 55 43.5 38 Q38 45 32 45 Q26 45 20.5 38Z"
          fill="#efece3"
          stroke="#d9d5c6"
          strokeWidth="0.8"
        />
        {/* eyes */}
        <circle cx="27.6" cy="38" r="1.7" fill="#2a2440" />
        <circle cx="36.4" cy="38" r="1.7" fill="#2a2440" />
        {/* mustache */}
        <path
          d="M32 42 Q26.5 41 23.5 46.5 Q28 45 32 43 Q36 45 40.5 46.5 Q37.5 41 32 42Z"
          fill="#efece3"
        />
        {/* hat */}
        <path
          d="M16.5 30 Q32 23.5 47.5 30 L44 21.5 Q47.5 9.5 52 4.5 Q40 8.5 32.5 18.5 Q23.5 27 18.5 25.5Z"
          fill="#3b49b8"
          stroke="#2a3392"
          strokeWidth="1"
        />
        <ellipse cx="32" cy="30" rx="16.5" ry="3.4" fill="#2f3aa0" />
        {/* pompom */}
        <circle cx="51" cy="4.7" r="2.2" fill="#ffcf47" />
        {/* stars on hat */}
        <polygon
          points="31,11.6 31.75,13.7 33.95,13.8 32.2,15.15 32.8,17.3 31,16.05 29.2,17.3 29.8,15.15 28.05,13.8 30.25,13.7"
          fill="#ffcf47"
        />
        <circle cx="38.5" cy="24.5" r="1.05" fill="#ffcf47" />
        <circle cx="25" cy="24" r="0.95" fill="#ffcf47" />
      </svg>
    </div>
  );
};
