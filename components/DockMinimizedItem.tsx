import React from "react";
import Image from "next/image";
import { useProcessStore } from "../store/processStore";
import { useIcon } from "./hooks/useIconManager";
import { Process } from "../types/process";

interface DockMinimizedItemProps {
  process: Process;
}

export const DockMinimizedItem: React.FC<DockMinimizedItemProps> = ({
  process,
}) => {
  const { focusProcess } = useProcessStore();
  const iconUrl = useIcon(process.icon as string);

  return (
    <button
      onClick={() => focusProcess(process.pid)}
      className="group relative -top-1 flex items-center justify-center transition-all duration-300 ease-out hover:brightness-110 active:brightness-90"
      style={{ width: 50, height: 50 }}
      aria-label={`Restore ${process.title}`}
    >
      {/* Minimized Window Preview (Glassy Rectangle) */}
      <div className="w-[50px] h-[50px] bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-sm overflow-hidden flex items-center justify-center relative">
        {/* App Icon (Large, Centered) */}
        {process.id === "finder" ? (
          <span className="text-2xl">📁</span>
        ) : iconUrl ? (
          <Image
            src={iconUrl}
            alt={process.title}
            width={24}
            height={24}
            className="w-6 h-6 object-contain opacity-80"
            unoptimized
          />
        ) : (
          <span className="text-xl opacity-80">
            {typeof process.icon === "string" ? process.icon : "APP"}
          </span>
        )}
      </div>

      {/* App Badge (Small Icon at Bottom Right) */}
      <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1 w-5 h-5 bg-white dark:bg-[#2c2c2c] rounded-full p-0.5 shadow-md z-10 flex items-center justify-center">
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt="Badge"
            width={16}
            height={16}
            className="w-full h-full object-contain"
            unoptimized
          />
        ) : (
          <span className="text-[10px]">
            {typeof process.icon === "string" ? process.icon : "•"}
          </span>
        )}
      </div>
    </button>
  );
};
