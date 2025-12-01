import React from "react";
import { Book } from "lucide-react";

interface BooksIconProps {
  size?: number;
  className?: string;
}

export const BooksIcon: React.FC<BooksIconProps> = ({
  size = 112,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-[22%] overflow-hidden shadow-2xl bg-linear-to-b from-[#FF9F0A] to-[#FF6B00] flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Book Icon */}
      <div className="text-white drop-shadow-md">
        <Book size={size * 0.5} fill="currentColor" strokeWidth={1.5} />
      </div>

      {/* Gloss Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent pointer-events-none" />
    </div>
  );
};
