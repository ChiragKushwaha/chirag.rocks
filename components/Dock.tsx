import React, { useState } from "react";
import { initialDockItems } from "../config/dock";
import { DockItem } from "./DockItem";

export const Dock: React.FC = () => {
  const [mouseX, setMouseX] = useState<number | null>(null);

  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center z-[9000] pointer-events-none">
      <div
        role="navigation"
        aria-label="Application dock"
        className="
          dock pointer-events-auto
          flex items-end gap-2 px-3 pb-3 pt-2.5
          bg-white/30 dark:bg-[rgba(30,30,30,0.35)]
          backdrop-blur-[50px] backdrop-saturate-[180%]
          border border-white/20 dark:border-white/10
          rounded-2xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.3)]
          dark:shadow-[0_10px_40px_-5px_rgba(0,0,0,0.6)]
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
