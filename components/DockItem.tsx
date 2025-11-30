import React, { useRef } from "react";
import { useSystemStore } from "../store/systemStore";
import { useProcessStore } from "../store/processStore";
import { Finder } from "../apps/Finder/Finder";
interface DockItemProps {
  name: string;
  icon: string;
  mouseX: number | null;
}

export const DockItem: React.FC<DockItemProps> = ({ name, icon, mouseX }) => {
  const { launchProcess, processes, activePid } = useProcessStore();

  const runningProcess = processes.find((p) => p.id === name);
  const isOpen = !!runningProcess;
  const isActive = runningProcess?.pid === activePid;

  const handleClick = () => {
    const component = (
      <div className="p-10 text-white">Placeholder for {name}</div>
    );

    if (name === "Finder") {
      launchProcess(name, "Finder", icon, <Finder />, {
        width: 900,
        height: 600,
        x: 50,
        y: 50,
      });
    }

    // NOTE: For 'Finder', we specifically want a larger default window
    // You might want to update your processStore launchProcess to accept dimensions
    launchProcess(name, "Finder", icon, component);
  };

  const imgRef = useRef<HTMLButtonElement>(null);
  const { activeApp, setActiveApp } = useSystemStore();

  // CONFIGURATION
  const baseWidth = 48; // Base icon size (px)
  const distanceLimit = 150; // How far the magnification reaches (px)
  const maxScale = 1.5; // Maximum magnification (1.5x)

  // 1. CALCULATE WIDTH ON THE FLY (No useEffect)
  let scale = 1;

  if (mouseX !== null && imgRef.current) {
    const rect = imgRef.current.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 2;
    const distance = mouseX - iconCenterX;

    if (Math.abs(distance) < distanceLimit) {
      // Use Cosine for a smooth bell-curve shape (Standard macOS curve)
      const distancePercent = distance / distanceLimit;
      const radians = distancePercent * Math.PI;
      // This formula creates a perfect bump (0 at edges, 1 at center)
      const bump = Math.cos(radians / 2); // simplified cosine bell

      scale = 1 + (maxScale - 1) * (bump * bump * bump); // Sharpen the curve slightly
    }
  }

  const width = baseWidth * scale;

  return (
    <div className="group relative flex flex-col items-center">
      {/* Tooltip */}
      <div
        className="absolute -top-12 px-3 py-1 rounded-md bg-gray-800/90 text-gray-200 text-xs 
                   backdrop-blur-md border border-gray-600/50 opacity-0 group-hover:opacity-100 
                   transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 font-medium"
      >
        {name}
      </div>

      {/* Icon */}
      <button
        ref={imgRef}
        onClick={handleClick}
        style={{
          width: `${width}px`,
          height: `${width}px`,
          fontSize: `${width * 0.55}px`, // Scale emoji text dynamically
        }}
        className={`
          flex items-center justify-center rounded-2xl shadow-lg border border-white/10
          bg-white/10 backdrop-blur-sm select-none
          /* KEY FIX: Only animate when mouse leaves (mouseX is null) */
          ${
            mouseX === null
              ? "transition-all duration-300 ease-out"
              : "transition-none"
          }
        `}
      >
        <span className="filter drop-shadow-md transform translate-y-[1px]">
          {icon === "safari" ? "🧭" : icon}
        </span>
      </button>

      {/* Active Dot */}
      <div
        className={`
  w-1 h-1 rounded-full bg-white/80 mt-1 shadow-[0_0_2px_rgba(255,255,255,0.8)] transition-opacity
  ${isOpen ? "opacity-100" : "opacity-0"}
`}
      />
    </div>
  );
};
