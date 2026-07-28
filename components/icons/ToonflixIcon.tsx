import React from "react";

interface ToonflixIconProps {
  size?: number;
  className?: string;
}

/**
 * Official Toonflix logo (from https://t00nflix.vercel.app/icons/icon.svg).
 */
export const ToonflixIcon: React.FC<ToonflixIconProps> = ({
  size = 112,
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-[22%] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 512 512"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tf-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e50914" />
            <stop offset="1" stopColor="#b20710" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="112" fill="#000000" />
        <rect x="96" y="96" width="320" height="320" rx="72" fill="url(#tf-g)" />
        <text
          x="256"
          y="332"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="220"
          fontWeight="900"
          textAnchor="middle"
          fill="#ffffff"
        >
          T
        </text>
      </svg>
    </div>
  );
};
