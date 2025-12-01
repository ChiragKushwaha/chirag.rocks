import React, { useState, useMemo } from "react";
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

export interface AppDef {
  id: string;
  name: string;
  icon: string;
  component: React.FC<any>;
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
      <div className="w-24 h-24 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
        {app.name === "Calendar" ? (
          <CalendarIcon size={96} />
        ) : iconUrl ? (
          <Image
            src={iconUrl}
            alt={app.name}
            width={96}
            height={96}
            className="w-full h-full drop-shadow-xl object-contain"
            unoptimized // Since we might be using blob URLs or local assets not optimized by Next.js image server
          />
        ) : (
          <div className="w-full h-full bg-gray-500/50 rounded-2xl animate-pulse" />
        )}
      </div>
      <span className="text-white text-sm font-medium drop-shadow-md tracking-wide">
        {app.name}
      </span>
    </div>
  );
};

export const Launchpad: React.FC = () => {
  const { launchProcess, closeProcess, processes } = useProcessStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApps = useMemo(() => {
    return APPS.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAppClick = (app: AppDef) => {
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
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-start pt-20 bg-black/40 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
      onClick={() => {
        const launchpadPid = processes.find((p) => p.id === "launchpad")?.pid;
        if (launchpadPid) closeProcess(launchpadPid);
      }}
    >
      {/* Search Bar */}
      <div
        className="w-full max-w-[280px] mb-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative group">
          <Search
            className="absolute left-2.5 top-2 text-gray-400 group-focus-within:text-white transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-md pl-9 pr-4 py-1.5 text-white placeholder-gray-400 text-sm focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-7 gap-x-12 gap-y-16 p-12 max-w-7xl w-full px-24">
        {filteredApps.map((app) => (
          <LaunchpadItem
            key={app.id}
            app={app}
            onClick={() => handleAppClick(app)}
          />
        ))}
      </div>

      {/* Page Indicators (Visual Only for now) */}
      <div className="absolute bottom-8 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-white" />
        <div className="w-2 h-2 rounded-full bg-white/30" />
      </div>
    </div>
  );
};
