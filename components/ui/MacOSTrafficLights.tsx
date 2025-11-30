import React from "react";

interface TrafficLightsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  disabled?: boolean;
}

export const MacOSTrafficLights: React.FC<TrafficLightsProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  disabled,
}) => {
  return (
    <div
      className={`flex items-center gap-2 group ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Close (Red) */}
      <button
        onClick={onClose}
        className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] flex items-center justify-center text-black/50 active:brightness-75 focus:outline-none"
      >
        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold leading-none mb-[1px]">
          ✕
        </span>
      </button>

      {/* Minimize (Yellow) */}
      <button
        onClick={onMinimize}
        className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] flex items-center justify-center text-black/50 active:brightness-75 focus:outline-none"
      >
        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold leading-none mb-[2px]">
          −
        </span>
      </button>

      {/* Maximize (Green) */}
      <button
        onClick={onMaximize}
        className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] flex items-center justify-center text-black/50 active:brightness-75 focus:outline-none"
      >
        <span className="opacity-0 group-hover:opacity-100 text-[6px] font-bold leading-none ml-[1px] mb-[1px]">
          +
        </span>
      </button>
    </div>
  );
};
