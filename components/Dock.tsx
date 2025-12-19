import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { initialDockItems } from "../config/dock";
import { DockItem } from "./DockItem";
import { useProcessStore } from "../store/processStore";
import { DockMinimizedItem } from "./DockMinimizedItem";

export const Dock: React.FC = () => {
  const t = useTranslations("Dock");
  const tApps = useTranslations("Apps");
  const [mouseX, setMouseX] = useState<number | null>(null);
  const { processes } = useProcessStore();

  return (
    <nav className="fixed bottom-2 left-0 right-0 flex justify-center z-9000 pointer-events-none">
      <ul
        aria-label={t("AriaLabel")}
        className="
            dock pointer-events-auto
            flex items-end gap-2 px-3 pb-3 pt-2.5
            bg-white/30 dark:bg-[rgba(30,30,30,0.35)]
            backdrop-blur-[50px] backdrop-saturate-180
            border border-white/20 dark:border-white/10
            rounded-2xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.3)]
            dark:shadow-[0_10px_40px_-5px_rgba(0,0,0,0.6)]
            transition-all ease-out duration-300
            list-none m-0
          "
        style={{ height: "auto", minHeight: "5rem" }}
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
      >
        {initialDockItems.map((item) => (
          <li key={item.name} className="flex-shrink-0">
            <DockItem
              name={item.name}
              label={tApps(item.name.replace(/\s+/g, ""))}
              icon={item.icon}
              mouseX={mouseX}
            />
          </li>
        ))}

        {/* Vertical Separator */}
        <li role="presentation" className="self-center">
          <div className="w-px h-10 bg-black/10 dark:bg-white/10 mx-1 rounded-full" />
        </li>

        {/* Minimized Windows */}
        {processes
          .filter((p) => p.isMinimized || p.isMinimizing)
          .map((p) => (
            <li key={p.pid} className="flex-shrink-0">
              <DockMinimizedItem process={p} />
            </li>
          ))}

        {/* Trash Can */}
        <li className="flex-shrink-0">
          <DockItem
            name="Trash"
            label={tApps("Trash")}
            icon="trash"
            mouseX={mouseX}
          />
        </li>
      </ul>
    </nav>
  );
};
