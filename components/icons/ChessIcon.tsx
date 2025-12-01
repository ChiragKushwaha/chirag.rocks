import React from "react";

export const ChessIcon = ({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-[22%] bg-linear-to-b from-[#4a4a4e] to-[#2e2e2e] shadow-lg border border-white/10 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Checkerboard Pattern Background */}
      <div className="absolute inset-2 overflow-hidden rounded-[18%] opacity-30">
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
          <div className="bg-black/40"></div>
          <div className="bg-white/10"></div>
          <div className="bg-white/10"></div>
          <div className="bg-black/40"></div>
        </div>
      </div>

      {/* Knight Piece */}
      <div
        className="relative z-10 text-white drop-shadow-lg"
        style={{ fontSize: size * 0.6 }}
      >
        ♞
      </div>

      {/* Gloss Effect */}
      <div className="absolute inset-0 rounded-[22%] bg-linear-to-br from-white/20 to-transparent pointer-events-none" />
    </div>
  );
};
