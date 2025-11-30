import React, { useState } from "react";
import { initialDockItems } from "../config/dock";
import { DockItem } from "./DockItem";

export const Dock: React.FC = () => {
  const [mouseX, setMouseX] = useState<number | null>(null);

  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center z-[9000]">
      {/* The Dock Container 
        - Height matches standard macOS Dock (~5rem)
        - Backdrop Blur 20px (heavy frost)
        - Border is extremely subtle white (10-20% opacity)
        - Background is white/black with ~20-30% opacity
      */}
      <div
        className="
          flex items-end gap-3 px-3 pb-3 pt-2.5
          bg-[rgba(245,245,245,0.3)] dark:bg-[rgba(30,30,30,0.3)]
          backdrop-blur-[25px] saturate-150
          border border-[rgba(255,255,255,0.15)] dark:border-[rgba(255,255,255,0.1)]
          rounded-[22px] shadow-[0_15px_30px_rgba(0,0,0,0.2)]
          transition-all ease-out duration-300
        "
        style={{ height: "auto", minHeight: "5rem" }}
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
      >
        {initialDockItems.map((item) => (
          <DockItem
            key={item.name}
            name={item.name}
            icon={item.icon}
            mouseX={mouseX}
          />
        ))}

        {/* Vertical Separator */}
        <div className="w-[1px] h-10 bg-black/10 dark:bg-white/10 mx-1 self-center rounded-full" />

        {/* Trash Can */}
        <DockItem name="Trash" icon="trash" mouseX={mouseX} />
      </div>
    </div>
  );
};
