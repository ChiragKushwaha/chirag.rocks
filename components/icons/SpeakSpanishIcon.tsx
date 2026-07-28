import React from "react";

interface SpeakSpanishIconProps {
  size?: number;
  className?: string;
}

/**
 * Official SpeakSpanish "Paco the parrot" logo
 * (from https://sp4nish.vercel.app/icon.svg).
 */
export const SpeakSpanishIcon: React.FC<SpeakSpanishIconProps> = ({
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
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sp-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#63d406" />
            <stop offset="1" stopColor="#46a302" />
          </linearGradient>
          <linearGradient id="sp-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe27a" />
            <stop offset="1" stopColor="#ffc800" />
          </linearGradient>
        </defs>

        {/* full-bleed background */}
        <rect width="512" height="512" fill="url(#sp-bg)" />

        {/* tuft feathers */}
        <path d="M236 118 Q228 78 256 74 Q264 100 254 126Z" fill="#ff4b4b" />
        <path d="M264 118 Q282 82 306 88 Q292 116 276 132Z" fill="#1cb0f6" />

        {/* body */}
        <ellipse cx="256" cy="288" rx="150" ry="158" fill="#eafcd8" />
        <ellipse cx="256" cy="300" rx="118" ry="130" fill="#63d406" />
        <ellipse cx="256" cy="318" rx="82" ry="96" fill="url(#sp-belly)" />

        {/* cheeks */}
        <circle cx="180" cy="290" r="24" fill="#ff8fab" opacity="0.85" />
        <circle cx="332" cy="290" r="24" fill="#ff8fab" opacity="0.85" />

        {/* eyes */}
        <circle cx="204" cy="250" r="34" fill="#fff" />
        <circle cx="308" cy="250" r="34" fill="#fff" />
        <circle cx="214" cy="256" r="16" fill="#3c3c3c" />
        <circle cx="318" cy="256" r="16" fill="#3c3c3c" />
        <circle cx="221" cy="249" r="6" fill="#fff" />
        <circle cx="325" cy="249" r="6" fill="#fff" />

        {/* beak */}
        <path d="M226 286 L286 286 L256 330Z" fill="#ff9600" />
      </svg>
    </div>
  );
};
