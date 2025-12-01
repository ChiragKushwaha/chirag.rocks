import React from "react";

export const SunIcon = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="14" fill="url(#sun-gradient)" />
    <circle cx="32" cy="32" r="14" fill="url(#sun-glow)" fillOpacity="0.5" />
    <g stroke="url(#sun-ray)" strokeWidth="4" strokeLinecap="round">
      <path d="M32 4V10" />
      <path d="M32 54V60" />
      <path d="M60 32L54 32" />
      <path d="M10 32L4 32" />
      <path d="M51.8 12.2L47.6 16.4" />
      <path d="M16.4 47.6L12.2 51.8" />
      <path d="M51.8 51.8L47.6 47.6" />
      <path d="M16.4 16.4L12.2 12.2" />
    </g>
    <defs>
      <radialGradient
        id="sun-gradient"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32 32) rotate(90) scale(14)"
      >
        <stop stopColor="#FDB813" />
        <stop offset="1" stopColor="#F5821F" />
      </radialGradient>
      <radialGradient
        id="sun-glow"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32 32) rotate(90) scale(14)"
      >
        <stop stopColor="#FFD700" stopOpacity="0.8" />
        <stop offset="1" stopColor="#FF8C00" stopOpacity="0" />
      </radialGradient>
      <linearGradient
        id="sun-ray"
        x1="32"
        y1="4"
        x2="32"
        y2="60"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FDB813" />
        <stop offset="1" stopColor="#F5821F" />
      </linearGradient>
    </defs>
  </svg>
);

export const CloudIcon = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M46 26C46 18.268 39.732 12 32 12C25.5 12 20.06 16.4 18.4 22.4C18.2 22.4 18 22.4 17.8 22.4C10.62 22.4 4.8 28.22 4.8 35.4C4.8 42.58 10.62 48.4 17.8 48.4H46C53.732 48.4 60 42.132 60 34.4C60 29.8 58.1 25.6 55.06 22.7C52.8 24.8 49.6 26 46 26Z"
      fill="url(#cloud-gradient)"
      filter="url(#cloud-shadow)"
    />
    <defs>
      <linearGradient
        id="cloud-gradient"
        x1="32"
        y1="12"
        x2="32"
        y2="48.4"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#E6E6E6" />
      </linearGradient>
      <filter
        id="cloud-shadow"
        x="0"
        y="8"
        width="64"
        height="48"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const PartlyCloudyIcon = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(-8, -4)">
      <circle cx="40" cy="24" r="10" fill="url(#pc-sun-gradient)" />
      <g stroke="url(#pc-sun-ray)" strokeWidth="3" strokeLinecap="round">
        <path d="M40 4V8" />
        <path d="M40 40V44" />
        <path d="M60 24L56 24" />
        <path d="M24 24L20 24" />
        <path d="M54.1 9.9L51.3 12.7" />
        <path d="M28.7 35.3L25.9 38.1" />
        <path d="M54.1 38.1L51.3 35.3" />
        <path d="M28.7 12.7L25.9 9.9" />
      </g>
    </g>
    <path
      d="M46 30C46 22.268 39.732 16 32 16C25.5 16 20.06 20.4 18.4 26.4C18.2 26.4 18 26.4 17.8 26.4C10.62 26.4 4.8 32.22 4.8 39.4C4.8 46.58 10.62 52.4 17.8 52.4H46C53.732 52.4 60 46.132 60 38.4C60 33.8 58.1 29.6 55.06 26.7C52.8 28.8 49.6 30 46 30Z"
      fill="url(#pc-cloud-gradient)"
      filter="url(#pc-cloud-shadow)"
    />
    <defs>
      <radialGradient
        id="pc-sun-gradient"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(40 24) rotate(90) scale(10)"
      >
        <stop stopColor="#FDB813" />
        <stop offset="1" stopColor="#F5821F" />
      </radialGradient>
      <linearGradient
        id="pc-sun-ray"
        x1="40"
        y1="4"
        x2="40"
        y2="44"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FDB813" />
        <stop offset="1" stopColor="#F5821F" />
      </linearGradient>
      <linearGradient
        id="pc-cloud-gradient"
        x1="32"
        y1="16"
        x2="32"
        y2="52.4"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#E6E6E6" />
      </linearGradient>
      <filter
        id="pc-cloud-shadow"
        x="0"
        y="12"
        width="64"
        height="48"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const RainIcon = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M46 26C46 18.268 39.732 12 32 12C25.5 12 20.06 16.4 18.4 22.4C18.2 22.4 18 22.4 17.8 22.4C10.62 22.4 4.8 28.22 4.8 35.4C4.8 42.58 10.62 48.4 17.8 48.4H46C53.732 48.4 60 42.132 60 34.4C60 29.8 58.1 25.6 55.06 22.7C52.8 24.8 49.6 26 46 26Z"
      fill="url(#rain-cloud-gradient)"
      filter="url(#rain-cloud-shadow)"
    />
    <path
      d="M24 52L20 60"
      stroke="#60A5FA"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M32 52L28 60"
      stroke="#60A5FA"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M40 52L36 60"
      stroke="#60A5FA"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient
        id="rain-cloud-gradient"
        x1="32"
        y1="12"
        x2="32"
        y2="48.4"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D1D5DB" />
        <stop offset="1" stopColor="#9CA3AF" />
      </linearGradient>
      <filter
        id="rain-cloud-shadow"
        x="0"
        y="8"
        width="64"
        height="48"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const MoonIcon = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M36 10C36 10 32 18 38 26C44 34 54 32 54 32C52 44 42 52 30 52C18 52 8 42 8 30C8 18 18 8 30 8C32.2 8 34.2 8.4 36 10Z"
      fill="url(#moon-gradient)"
      filter="url(#moon-shadow)"
    />
    <defs>
      <linearGradient
        id="moon-gradient"
        x1="16"
        y1="8"
        x2="44"
        y2="52"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E2E8F0" />
        <stop offset="1" stopColor="#94A3B8" />
      </linearGradient>
      <filter
        id="moon-shadow"
        x="4"
        y="4"
        width="56"
        height="56"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
