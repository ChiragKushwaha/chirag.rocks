import React, { useRef } from "react";
import { useSystemStore } from "../store/systemStore";
import { useProcessStore } from "../store/processStore";
import { Finder } from "../apps/Finder/Finder";
import { useIcon } from "./hooks/useIconManager";
import { Terminal } from "../apps/Terminal";
import { Calculator } from "../apps/Calculator";
import { Trash } from "../apps/Trash";
import { Messages } from "../apps/Messages";
import { FaceTime } from "../apps/FaceTime";
import { CalendarIcon } from "./icons/CalendarIcon";
import { SystemSettings } from "../apps/SystemSettings";
import { Calendar } from "../apps/Calendar";
import { Notes } from "../apps/Notes";
import { Reminders } from "../apps/Reminders";
import { Contacts } from "../apps/Contacts";
import { Safari } from "../apps/Safari";
import { Mail } from "../apps/Mail";
import { Maps } from "../apps/Maps";
import { Music } from "../apps/Music";
import { TV } from "../apps/TV";
import { News } from "../apps/News";
import { AppStore } from "../apps/AppStore";
import { Launchpad } from "../apps/Launchpad";
import { Freeform } from "../apps/Freeform";

interface DockItemProps {
  name: string;
  icon: string;
  mouseX: number | null;
}

export const DockItem: React.FC<DockItemProps> = ({ name, icon, mouseX }) => {
  const { launchProcess, processes, activePid } = useProcessStore();
  const { trashCount } = useSystemStore();

  // Dynamic Icon Logic
  let displayIcon = icon;
  if (name === "Trash" && trashCount > 0) {
    displayIcon = "trash_full";
  }

  const iconUrl = useIcon(displayIcon); // Get Blob URL from OPFS

  const runningProcess = processes.find((p) => p.id === name);
  const isOpen = !!runningProcess;
  const isActive = runningProcess?.pid === activePid;

  const handleClick = () => {
    let component = (
      <div className="p-10 text-white">Placeholder for {name}</div>
    );
    const title = name;

    if (name === "Finder") {
      launchProcess("finder", "Finder", icon, <Finder />, {
        width: 900,
        height: 600,
        x: 50,
        y: 50,
      });
      return;
    } else if (name === "Terminal") {
      component = <Terminal />;
    } else if (name === "Calculator") {
      component = <Calculator />;
    } else if (name === "Trash") {
      component = <Trash />;
    } else if (name === "Messages") {
      component = <Messages />;
    } else if (name === "FaceTime") {
      component = <FaceTime />;
    } else if (name === "System Settings") {
      component = <SystemSettings />;
    } else if (name === "Calendar") {
      component = <Calendar />;
    } else if (name === "Notes") {
      component = <Notes />;
    } else if (name === "Reminders") {
      component = <Reminders />;
    } else if (name === "Contacts") {
      component = <Contacts />;
    } else if (name === "Safari") {
      component = <Safari />;
    } else if (name === "Mail") {
      component = <Mail />;
    } else if (name === "Maps") {
      component = <Maps />;
    } else if (name === "Music") {
      component = <Music />;
    } else if (name === "TV") {
      component = <TV />;
    } else if (name === "News") {
      component = <News />;
    } else if (name === "App Store") {
      component = <AppStore />;
    } else if (name === "Launchpad") {
      component = <Launchpad />;
    } else if (name === "Freeform") {
      component = <Freeform />;
    }

    launchProcess(name.toLowerCase(), title, icon, component);
  };

  const imgRef = useRef<HTMLButtonElement>(null);
  const { activeApp, setActiveApp } = useSystemStore();

  // CONFIGURATION
  const baseWidth = 48; // Base icon size (px)
  const distanceLimit = 150; // How far the magnification reaches (px)
  const maxScale = 1.5; // Maximum magnification (1.5x)

  // 1. CALCULATE WIDTH ON THE FLY (No useEffect)
  const scale = 1;

  /* Magnification disabled as per user request
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
  */

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
          flex items-center justify-center rounded-2xl 
            /* Removed background/border to fix "black space" issue */
            name === "Calendar" ? "" : ""
          }
          select-none
          /* KEY FIX: Only animate when mouse leaves (mouseX is null) */
          ${
            mouseX === null
              ? "transition-all duration-300 ease-out"
              : "transition-none"
          }
        `}
      >
        <span
          className="filter drop-shadow-md transform translate-y-[1px]"
          style={{ width: width, height: width }}
        >
          {name === "Calendar" ? (
            <CalendarIcon size={width} />
          ) : iconUrl ? (
            <img
              src={iconUrl}
              alt={name}
              className="w-full h-full scale-[1.28]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallbacks: Record<string, string> = {
                  launchpad: "🚀",
                  apps: "🚀",
                  calendar: "📅",
                  safari: "🧭",
                  finder: "😊",
                  mail: "✉️",
                  messages: "💬",
                  maps: "🗺️",
                  photos: "📸",
                  facetime: "📹",
                  contacts: "📒",
                  reminders: "✅",
                  notes: "📝",
                  music: "🎵",
                  news: "📰",
                  tv: "📺",
                  app_store: "🅰️",
                  settings: "⚙️",
                  terminal: "💻",
                  calculator: "🧮",
                  freeform: "✏️",
                  trash: "🗑️",
                  trash_full: "🗑️",
                };
                e.currentTarget.parentElement!.innerHTML =
                  fallbacks[icon] || icon;
              }}
            />
          ) : (
            <span className="text-2xl">{icon}</span> // Temporary fallback while loading
          )}
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
