import React from "react";

interface SacredTextsIconProps {
  size?: number;
  className?: string;
}

/**
 * Official Sacred Texts logo (from https://sacred-texts.xyz/icon.svg).
 */
export const SacredTextsIcon: React.FC<SacredTextsIconProps> = ({
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
          <linearGradient id="st-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e7c079" />
            <stop offset="1" stopColor="#b07d2b" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="112" fill="url(#st-bg)" />
        <g transform="translate(76 82) scale(15)" fill="#3a2708">
          <path d="M12 3c1.7 2 1.7 4.6 0 7-1.7-2.4-1.7-5 0-7Z" />
          <path
            d="M12 10.5c-2-1.6-4.4-1.9-6.7-.9 1 2.4 2.9 3.9 5.4 4.4M12 10.5c2-1.6 4.4-1.9 6.7-.9-1 2.4-2.9 3.9-5.4 4.4"
            opacity="0.6"
          />
          <path
            d="M4 13c-.6 2.3.2 4.4 2 6 2.3-.7 3.9-2.2 4.6-4.4M20 13c.6 2.3-.2 4.4-2 6-2.3-.7-3.9-2.2-4.6-4.4"
            opacity="0.4"
          />
        </g>
      </svg>
    </div>
  );
};
