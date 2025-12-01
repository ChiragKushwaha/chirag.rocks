import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useProcessStore } from "../store/processStore";
import { useIcon } from "../components/hooks/useIconManager";
import { Finder } from "./Finder/Finder";
import { Safari } from "./Safari";
import { Messages } from "./Messages";
import { Mail } from "./Mail";
import { Maps } from "./Maps";
import { FaceTime } from "./FaceTime";
import { Calendar } from "./Calendar";
import { Contacts } from "./Contacts";
import { Reminders } from "./Reminders";
import { Notes } from "./Notes";
import { Music } from "./Music";
import { TV } from "./TV";
import { News } from "./News";
import { AppStore } from "./AppStore";
import { SystemSettings } from "./SystemSettings";
import { Freeform } from "./Freeform";
import { Terminal } from "./Terminal";
import { Calculator } from "./Calculator";
import { Trash } from "./Trash";
import { Photos } from "./Photos";
import { CalendarIcon } from "../components/icons/CalendarIcon";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("./PDFViewer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

export interface AppDef {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
}

export const APPS: AppDef[] = [
  { id: "finder", name: "Finder", icon: "finder", component: Finder },
  { id: "safari", name: "Safari", icon: "safari", component: Safari },
  { id: "messages", name: "Messages", icon: "messages", component: Messages },
  { id: "mail", name: "Mail", icon: "mail", component: Mail },
  { id: "maps", name: "Maps", icon: "maps", component: Maps },
  { id: "photos", name: "Photos", icon: "photos", component: Photos },
  { id: "facetime", name: "FaceTime", icon: "facetime", component: FaceTime },
  { id: "calendar", name: "Calendar", icon: "calendar", component: Calendar },
  { id: "contacts", name: "Contacts", icon: "contacts", component: Contacts },
  {
    id: "reminders",
    name: "Reminders",
    icon: "reminders",
    component: Reminders,
  },
  { id: "notes", name: "Notes", icon: "notes", component: Notes },
  { id: "music", name: "Music", icon: "music", component: Music },
  { id: "tv", name: "TV", icon: "tv", component: TV },
  { id: "news", name: "News", icon: "news", component: News },
  { id: "appstore", name: "App Store", icon: "app_store", component: AppStore },
  {
    id: "settings",
    name: "System Settings",
    icon: "settings",
    component: SystemSettings,
  },
  { id: "freeform", name: "Freeform", icon: "freeform", component: Freeform },
  { id: "terminal", name: "Terminal", icon: "terminal", component: Terminal },
  {
    id: "calculator",
    name: "Calculator",
    icon: "calculator",
    component: Calculator,
  },
  { id: "trash", name: "Trash", icon: "trash", component: Trash },
  { id: "preview", name: "Preview", icon: "preview", component: PDFViewer },
];

const LaunchpadItem: React.FC<{
  app: AppDef;
  onClick: () => void;
}> = ({ app, onClick }) => {
  const iconUrl = useIcon(app.icon);

  return (
    <div
      className="flex flex-col items-center gap-4 group cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="w-[112px] h-[112px] min-w-[112px] min-h-[112px] transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95 flex items-center justify-center">
        {app.name === "Calendar" ? (
          <CalendarIcon size={90} />
        ) : iconUrl ? (
          <Image
            src={iconUrl}
            alt={app.name}
            width={112}
            height={112}
            className="w-[112px] h-[112px] drop-shadow-2xl object-contain"
            unoptimized
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gray-500/50 rounded-[26px] animate-pulse" />
        )}
      </div>
      <span className="text-white text-[15px] font-semibold drop-shadow-lg tracking-tight opacity-90 group-hover:opacity-100">
        {app.name}
      </span>
    </div>
  );
};

export const Launchpad: React.FC = () => {
  const { launchProcess, closeProcess, processes } = useProcessStore();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 35;

  const filteredApps = useMemo(() => {
    return APPS.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApps.length / ITEMS_PER_PAGE)
  );
  const currentApps = filteredApps.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleAppClick = React.useCallback(
    (app: AppDef) => {
      // Close Launchpad first
      const launchpadPid = processes.find((p) => p.id === "launchpad")?.pid;
      if (launchpadPid) closeProcess(launchpadPid);

      // Launch the app
      // Special handling for Finder which might need specific props or just default
      if (app.name === "Finder") {
        launchProcess("finder", "Finder", app.icon, <Finder />, {
          width: 900,
          height: 600,
          x: 50,
          y: 50,
        });
      } else {
        launchProcess(app.id, app.name, app.icon, <app.component />);
      }
    },
    [processes, closeProcess, launchProcess]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(0);
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const launchpadPid = processes.find((p) => p.id === "launchpad")?.pid;
        if (launchpadPid) closeProcess(launchpadPid);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [processes, closeProcess]);

  // Keyboard Navigation
  useEffect(() => {
    const handleNav = (e: KeyboardEvent) => {
      if (searchTerm) return; // Disable grid nav when searching

      const cols = 7;
      const rows = 5;
      const itemsPerPage = cols * rows;
      const maxIndex = currentApps.length - 1;

      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => Math.min(prev + 1, maxIndex));
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => Math.min(prev + cols, maxIndex));
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(prev - cols, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex <= maxIndex) {
          handleAppClick(currentApps[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [currentApps, selectedIndex, searchTerm, handleAppClick]);

  // Reset selection when page changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [currentPage]);

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);

  const handleClose = () => {
    const launchpadPid = processes.find((p) => p.id === "launchpad")?.pid;
    if (launchpadPid) closeProcess(launchpadPid);
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="w-screen h-screen max-w-none max-h-none bg-transparent m-0 p-0 backdrop:bg-black/40 backdrop:backdrop-blur-[100px] animate-in fade-in zoom-in-95 duration-200 ease-out overflow-hidden outline-none pointer-events-auto"
      onClick={handleClose}
      onCancel={handleClose}
    >
      <div className="flex flex-col items-center w-full h-full pt-[4vh] pb-[2vh]">
        {/* Search Bar */}
        <div
          className="flex items-center group w-full max-w-[240px] mb-6"
          onClick={(e) => e.stopPropagation()}
        >
          <Search
            className="relative z-1 left-8 text-white/50 group-focus-within:text-white transition-colors"
            size={14}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0); // Select first result on search
            }}
            className="w-full bg-white/10 border border-white/20 rounded-[8px] pl-9 pr-3 py-1.5 text-white placeholder-white/50 text-[14px] font-light focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all text-center focus:text-left focus:placeholder-transparent shadow-lg backdrop-blur-md"
            autoFocus
          />
        </div>

        {/* App Grid - 7x5 Layout */}
        <div className="flex-1 w-full px-[4vw]">
          <div className="grid grid-cols-7 grid-rows-5 w-full h-full place-items-center">
            {currentApps.map((app, index) => (
              <div
                onClick={(e) => e.stopPropagation()}
                key={app.id}
                className={`relative group rounded-xl transition-all duration-200 ${
                  index === selectedIndex
                    ? "bg-white/10 ring-1 ring-white/20"
                    : ""
                }`}
              >
                <LaunchpadItem app={app} onClick={() => handleAppClick(app)} />
              </div>
            ))}
          </div>
        </div>

        {/* Page Indicators */}
        <div className="flex gap-3 mt-8" onClick={(e) => e.stopPropagation()}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`w-[8px] h-[8px] rounded-full shadow-sm transition-all duration-200 cursor-pointer border border-white/10 ${
                i === currentPage
                  ? "bg-white scale-110"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => setCurrentPage(i)}
            />
          ))}
        </div>
      </div>
    </dialog>
  );
};
