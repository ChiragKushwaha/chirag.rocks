import React from "react";

interface CalendarIconProps {
  size?: number;
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({ size = 112 }) => {
  const date = new Date();
  const dayName = date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const dayNumber = date.getDate();

  // Scale factors based on size (assuming base design is for ~64px)
  // But since we use percentages/ems, it should scale naturally if we set font size on container

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22, // macOS rounded corner ratio
      }}
      className="bg-white flex flex-col overflow-hidden relative select-none"
    >
      {/* Red Header */}
      <div className="h-[28%] bg-[#ff3b30] flex items-center justify-center">
        <span
          className="text-white font-bold tracking-wide"
          style={{ fontSize: size * 0.18 }}
        >
          {dayName}
        </span>
      </div>

      {/* Body (Date) */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <span
          className="text-black font-light -mt-[10%]"
          style={{
            fontSize: size * 0.55,
            fontFamily: "SF Pro Display, sans-serif",
          }}
        >
          {dayNumber}
        </span>
      </div>
    </div>
  );
};
