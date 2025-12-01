import React, { useEffect, useState } from "react";

interface ClockIconProps {
  size?: number;
  className?: string;
}

export const ClockIcon: React.FC<ClockIconProps> = ({
  size = 112,
  className = "",
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div
      className={`relative rounded-[22%] overflow-hidden shadow-2xl bg-white ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Clock Face */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[6%] h-[12%] bg-black"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-320%)`,
              borderRadius: size * 0.02,
            }}
          />
        ))}

        {/* Hour Hand */}
        <div
          className="absolute w-[6%] h-[25%] bg-black origin-bottom rounded-full"
          style={{
            transform: `rotate(${hourDeg}deg) translateY(-50%)`,
            bottom: "50%",
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute w-[4%] h-[35%] bg-black origin-bottom rounded-full"
          style={{
            transform: `rotate(${minuteDeg}deg) translateY(-50%)`,
            bottom: "50%",
          }}
        />

        {/* Second Hand */}
        <div
          className="absolute w-[2%] h-[40%] bg-[#FF9F0A] origin-bottom rounded-full"
          style={{
            transform: `rotate(${secondDeg}deg) translateY(-20%)`,
            bottom: "50%",
          }}
        />

        {/* Center Dot */}
        <div
          className="absolute bg-[#FF9F0A] rounded-full"
          style={{ width: size * 0.06, height: size * 0.06 }}
        />
      </div>
    </div>
  );
};
