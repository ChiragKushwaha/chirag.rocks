import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { useProcessStore } from "../store/processStore";
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
import { Weather } from "./Weather";
import { Clock } from "./Clock";
import { CalendarIcon } from "../components/icons/CalendarIcon";
import { WeatherIcon } from "../components/icons/WeatherIcon";
import { ClockIcon } from "../components/icons/ClockIcon";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("./PDFViewer").then((mod) => mod.PDFViewer),
  { ssr: false }
);
import { Chess } from "./Chess";
import { ChessIcon } from "../components/icons/ChessIcon";
import { Stocks } from "./Stocks";
import { StocksIcon } from "../components/icons/StocksIcon";
import { BooksIcon } from "../components/icons/BooksIcon";
import { PlaceholderApp } from "./PlaceholderApp";

export interface AppDef {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  component: React.ComponentType;
}

export const APPS: AppDef[] = [
  {
    id: "finder",
    name: "Finder",
    icon: ({ className }) => (
      <div className={className}>
        <Image
          src="/icons/finder.png"
          alt="Finder"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Finder,
  },
  {
    id: "safari",
    name: "Safari",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/safari.png"
          alt="Safari"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Safari,
  },
  {
    id: "messages",
    name: "Messages",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/messages.png"
          alt="Messages"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Messages,
  },
  {
    id: "mail",
    name: "Mail",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/mail.png"
          alt="Mail"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Mail,
  },
  {
    id: "maps",
    name: "Maps",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/maps.png"
          alt="Maps"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Maps,
  },
  {
    id: "photos",
    name: "Photos",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/photos.png"
          alt="Photos"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Photos,
  },
  {
    id: "facetime",
    name: "FaceTime",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/facetime.png"
          alt="FaceTime"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: FaceTime,
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: () => <CalendarIcon size={90} />,
    component: Calendar,
  },
  {
    id: "contacts",
    name: "Contacts",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/contacts.png"
          alt="Contacts"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Contacts,
  },
  {
    id: "reminders",
    name: "Reminders",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/reminders.png"
          alt="Reminders"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Reminders,
  },
  {
    id: "notes",
    name: "Notes",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/notes.png"
          alt="Notes"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Notes,
  },
  {
    id: "music",
    name: "Music",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/music.png"
          alt="Music"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Music,
  },
  {
    id: "podcasts",
    name: "Podcasts",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/podcasts.png"
          alt="Podcasts"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: () => <PlaceholderApp title="Podcasts" />,
  },
  {
    id: "tv",
    name: "TV",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/tv.png"
          alt="TV"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: TV,
  },
  {
    id: "books",
    name: "Books",
    icon: () => <BooksIcon size={90} />,
    component: () => <PlaceholderApp title="Books" />,
  },
  {
    id: "news",
    name: "News",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/news.png"
          alt="News"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: News,
  },
  {
    id: "appstore",
    name: "App Store",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/appstore.png"
          alt="App Store"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: AppStore,
  },
  {
    id: "settings",
    name: "System Settings",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/settings.png"
          alt="System Settings"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: SystemSettings,
  },
  {
    id: "freeform",
    name: "Freeform",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/freeform.png"
          alt="Freeform"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Freeform,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/terminal.png"
          alt="Terminal"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Terminal,
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/calculator.png"
          alt="Calculator"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Calculator,
  },
  {
    id: "trash",
    name: "Trash",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/trash.png"
          alt="Trash"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: Trash,
  },
  {
    id: "preview",
    name: "Preview",
    icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/preview.png"
          alt="Preview"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
    ),
    component: PDFViewer,
  },
  {
    id: "weather",
    name: "Weather",
    icon: () => <WeatherIcon size={90} />,
    component: Weather,
  },
  {
    id: "clock",
    name: "Clock",
    icon: () => <ClockIcon size={90} />,
    component: Clock,
  },
  {
    id: "chess",
    name: "Chess",
    icon: () => <ChessIcon size={96} />,
    component: Chess,
  },
  {
    id: "stocks",
    name: "Stocks",
    icon: () => <StocksIcon size={96} />,
    component: Stocks,
  },
];

const LaunchpadItem: React.FC<{
  app: AppDef;
  onClick: () => void;
}> = ({ app, onClick }) => {
  const Icon = app.icon;

  return (
    <div
      className="flex flex-col items-center gap-4 group cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="w-[112px] h-[112px] min-w-[112px] min-h-[112px] transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95 flex items-center justify-center">
        <Icon
          size={112}
          className="w-full h-full drop-shadow-2xl object-contain"
        />
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const ITEMS_PER_PAGE = 35;

  const filteredApps = useMemo(() => {
    return APPS.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(0);
    setSelectedIndex(-1);
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

  useEffect(() => {
    // Initial state is already set by useState
  }, []);

  const onClose = useCallback(() => {
    const launchpadPid = processes.find((p) => p.id === "launchpad")?.pid;
    if (launchpadPid) closeProcess(launchpadPid);
    dialogRef.current?.close();
  }, [processes, closeProcess]);

  const scrollToPage = useCallback((pageIndex: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: pageIndex * window.innerWidth,
        behavior: "smooth",
      });
      setCurrentPage(pageIndex);
      setSelectedIndex(-1);
    }
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Close Launchpad
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (selectedIndex === -1) {
          if (currentPage > 0) scrollToPage(currentPage - 1);
        } else {
          setSelectedIndex((prev) => Math.max(0, prev - 1));
        }
      } else if (e.key === "ArrowRight") {
        if (selectedIndex === -1) {
          if (currentPage < totalPages - 1) scrollToPage(currentPage + 1);
        } else {
          setSelectedIndex((prev) =>
            Math.min(filteredApps.length - 1, prev + 1)
          );
        }
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(0, prev - 5)); // Assuming 5 columns
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => Math.min(filteredApps.length - 1, prev + 5));
      } else if (e.key === "Enter") {
        if (selectedIndex !== -1) {
          const app = filteredApps[selectedIndex];
          if (app) handleAppClick(app);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentPage,
    selectedIndex,
    filteredApps,
    onClose,
    totalPages,
    scrollToPage,
    handleAppClick,
  ]); // Added scrollToPage and handleAppClick to dependencies

  // Reset selection when page changes - handled in scrollToPage and searchTerm effect
  // useEffect(() => {
  //   setSelectedIndex(-1);
  // }, [currentPage]);

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
              onClick={() => {
                setCurrentPage(i);
                setSelectedIndex(-1);
              }}
            />
          ))}
        </div>
      </div>
    </dialog>
  );
};
