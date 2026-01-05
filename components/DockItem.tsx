import React, { useRef } from "react";
import Image from "next/image";
import { useSystemStore } from "../store/systemStore";
import { useProcessStore } from "../store/processStore";
import dynamic from "next/dynamic";
import { useIcon } from "./hooks/useIconManager";
import { CalendarIcon } from "./icons/CalendarIcon";

const Finder = dynamic(() =>
  import("../apps/Finder/Finder").then((mod) => mod.Finder)
);
const Terminal = dynamic(() =>
  import("../apps/Terminal").then((mod) => mod.Terminal)
);
const Calculator = dynamic(() =>
  import("../apps/Calculator").then((mod) => mod.Calculator)
);
const Trash = dynamic(() => import("../apps/Trash").then((mod) => mod.Trash));
const Messages = dynamic(() =>
  import("../apps/Messages").then((mod) => mod.Messages)
);
const FaceTime = dynamic(() =>
  import("../apps/FaceTime").then((mod) => mod.FaceTime)
);
const SystemSettings = dynamic(() =>
  import("../apps/SystemSettings").then((mod) => mod.SystemSettings)
);
const Calendar = dynamic(() =>
  import("../apps/Calendar").then((mod) => mod.Calendar)
);
const Notes = dynamic(() => import("../apps/Notes").then((mod) => mod.Notes));
const Reminders = dynamic(() =>
  import("../apps/Reminders").then((mod) => mod.Reminders)
);
const Contacts = dynamic(() =>
  import("../apps/Contacts").then((mod) => mod.Contacts)
);
const Safari = dynamic(() =>
  import("../apps/Safari").then((mod) => mod.Safari)
);
const Mail = dynamic(() => import("../apps/Mail").then((mod) => mod.Mail));
const Maps = dynamic(() => import("../apps/Maps").then((mod) => mod.Maps));
const Music = dynamic(() => import("../apps/Music").then((mod) => mod.Music));
const TV = dynamic(() => import("../apps/TV").then((mod) => mod.TV));
const News = dynamic(() => import("../apps/News").then((mod) => mod.News));
const AppStore = dynamic(() =>
  import("../apps/AppStore").then((mod) => mod.AppStore)
);
const Launchpad = dynamic(() =>
  import("../apps/Launchpad").then((mod) => mod.Launchpad)
);
const Freeform = dynamic(() =>
  import("../apps/Freeform").then((mod) => mod.Freeform)
);
const Photos = dynamic(() =>
  import("../apps/Photos").then((mod) => mod.Photos)
);

interface DockItemProps {
  name: string;
  label?: string; // Translated name for display
  icon: string;
  mouseX: number | null;
}

export const DockItem: React.FC<DockItemProps> = ({
  name,
  label,
  icon,
  mouseX,
}) => {
  const { launchProcess } = useProcessStore();

  // Optimization: Only subscribe to the existence of the process, not the entire array update
  // This prevents re-renders when other windows move/resize
  const isOpen = useProcessStore(
    (state) =>
      !!state.processes.find(
        (p) => p.id === name.toLowerCase() || p.title === name
      )
  );

  const { trashCount } = useSystemStore();

  // Dynamic Icon Logic
  let displayIcon = icon;
  if (name === "Trash" && trashCount > 0) {
    displayIcon = "trash_full";
  }

  const iconUrl = useIcon(displayIcon); // Get Blob URL from OPFS

  const [isBouncing, setIsBouncing] = React.useState(false);

  const handleClick = () => {
    if (!isOpen) {
      setIsBouncing(true);
      // No timeout needed, onAnimationEnd handles reset
    }

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
      launchProcess(
        "launchpad",
        "Launchpad",
        icon,
        <Launchpad />,
        {
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
        },
        false
      );
      return;
    } else if (name === "Freeform") {
      component = <Freeform />;
    } else if (name === "Photos") {
      component = <Photos />;
    }

    launchProcess(name.toLowerCase(), title, icon, component);
  };

  const imgRef = useRef<HTMLButtonElement>(null);

  // CONFIGURATION
  const baseWidth = 50; // Base icon size (px) - Big Sur style

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

  const displayName = label || name;

  return (
    <div className="group relative flex flex-col items-center">
      {/* Tooltip */}
      <div
        className="absolute -top-12 px-3 py-1 rounded-md bg-gray-800/90 text-gray-200 text-xs 
                   backdrop-blur-md border border-gray-600/50 opacity-0 group-hover:opacity-100 
                   transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 font-medium"
      >
        {displayName}
      </div>

      {/* Icon */}
      <button
        ref={imgRef}
        onClick={handleClick}
        aria-label={`${displayName}${isOpen ? " (running)" : ""}`}
        style={{
          width: `${width}px`,
          height: `${width}px`,
          fontSize: `${width * 0.55}px`, // Scale emoji text dynamically
        }}
        className={`
          flex items-center justify-center rounded-2xl 
            /* Removed background/border to fix "black space" issue */
            ${name === "Calendar" ? "" : ""}
          select-none
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
          ${
            mouseX === null
              ? "transition-all duration-300 ease-out"
              : "transition-none"
          }
          ${isBouncing ? "animate-dock-bounce" : ""}
        `}
        onAnimationEnd={() => setIsBouncing(false)}
      >
        <span
          className="filter drop-shadow-md transform translate-y-px"
          style={{ width: width, height: width }}
        >
          {name === "Calendar" ? (
            <CalendarIcon size={width} />
          ) : iconUrl ? (
            <Image
              src={iconUrl}
              alt={name}
              width={width}
              height={width}
              className="w-full h-full scale-[1.28] object-contain"
              unoptimized
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
