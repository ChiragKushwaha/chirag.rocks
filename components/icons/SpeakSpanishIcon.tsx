import React from "react";

interface SpeakSpanishIconProps {
  size?: number;
  className?: string;
}

/**
 * sp4nish / SpeakSpanish — learn Spanish, one swipe at a time.
 * A friendly chat bubble greeting "¡Hola!" set on Spanish-flag red with a
 * golden accent bar.
 */
export const SpeakSpanishIcon: React.FC<SpeakSpanishIconProps> = ({
  size = 112,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-[22%] overflow-hidden shadow-2xl bg-linear-to-b from-[#e11d2e] via-[#c60b1e] to-[#8f0616] flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Speech bubble */}
        <path
          d="M22 24 H78 A10 10 0 0 1 88 34 V60 A10 10 0 0 1 78 70 H44 L30 82 L32 70 H22 A10 10 0 0 1 12 60 V34 A10 10 0 0 1 22 24 Z"
          fill="#ffffff"
        />
        {/* Greeting */}
        <text
          x="50"
          y="52"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="26"
          fontWeight="700"
          fill="#c60b1e"
        >
          ¡Hola!
        </text>
        {/* Spanish-flag gold accent */}
        <rect x="34" y="58" width="32" height="4" rx="2" fill="#f5b301" />
      </svg>

      {/* Gloss */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/15 to-transparent" />
    </div>
  );
};
