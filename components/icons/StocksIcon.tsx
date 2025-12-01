import React from "react";

export const StocksIcon = ({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-[22%] bg-black shadow-lg border border-white/10 overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-[#1c1c1e] to-[#000000]" />

      {/* Chart Line */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full p-[15%]"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C20,80 20,60 40,60 C60,60 60,30 100,20"
          fill="none"
          stroke="#34C759"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_10px_rgba(52,199,89,0.6)]"
        />
        {/* Fill Area */}
        <path
          d="M0,80 C20,80 20,60 40,60 C60,60 60,30 100,20 L100,100 L0,100 Z"
          fill="url(#stockGradient)"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34C759" />
            <stop offset="100%" stopColor="#34C759" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Gloss Effect */}
      <div className="absolute inset-0 rounded-[22%] bg-linear-to-br from-white/20 to-transparent pointer-events-none" />
    </div>
  );
};
