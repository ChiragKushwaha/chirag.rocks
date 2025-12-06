import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
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
import { VSCode } from "./VSCode";
import { LeetCode } from "./LeetCode";
import { SocialApp } from "./SocialApp";
import { ExternalLinkDialog } from "../components/ExternalLinkDialog";

export interface AppDef {
  id: string;
  name: string;
  icon: React.ComponentType<{
    className?: string;
    containerClassName?: string;
    imageClassName?: string;
    size?: number;
  }>;
  component: React.ComponentType;
  url?: string;
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
    icon: CalendarIcon,
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
    icon: BooksIcon,
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
    icon: WeatherIcon,
    component: Weather,
  },
  {
    id: "clock",
    name: "Clock",
    icon: ClockIcon,
    component: Clock,
  },
  {
    id: "chess",
    name: "Chess",
    icon: ChessIcon,
    component: Chess,
  },
  {
    id: "stocks",
    name: "Stocks",
    icon: StocksIcon,
    component: Stocks,
  },
  {
    id: "vscode",
    name: "VS Code",
    icon: ({ className, imageClassName = "p-2 rounded-3xl scale-[0.75]" }) => (
      <div className={`${className} relative`}>
        <Image
          src="/icons/vscode.png"
          alt="VS Code"
          fill
          className={`object-contain drop-shadow-lg bg-white ${imageClassName}`}
        />
      </div>
    ),
    component: VSCode,
  },
  {
    id: "leetcode",
    name: "LeetCode",
    icon: ({ className, containerClassName = "scale-[0.85]" }) => (
      <div
        className={`${className} ${containerClassName} relative flex items-center justify-center bg-[#282828] rounded-[22%] overflow-hidden`}
      >
        <svg
          viewBox="0 0 32 32"
          className="w-[60%] h-[60%] fill-[#FFA116]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21.469 23.907l-3.595 3.473c-0.624 0.625-1.484 0.885-2.432 0.885s-1.807-0.26-2.432-0.885l-5.776-5.812c-0.62-0.625-0.937-1.537-0.937-2.485 0-0.952 0.317-1.812 0.937-2.432l5.76-5.844c0.62-0.619 1.5-0.859 2.448-0.859s1.808 0.26 2.432 0.885l3.595 3.473c0.687 0.688 1.823 0.663 2.536-0.052 0.708-0.713 0.735-1.848 0.047-2.536l-3.473-3.511c-0.901-0.891-2.032-1.505-3.261-1.787l3.287-3.333c0.688-0.687 0.667-1.823-0.047-2.536s-1.849-0.735-2.536-0.052l-13.469 13.469c-1.307 1.312-1.989 3.113-1.989 5.113 0 1.996 0.683 3.86 1.989 5.168l5.797 5.812c1.307 1.307 3.115 1.937 5.115 1.937 1.995 0 3.801-0.683 5.109-1.989l3.479-3.521c0.688-0.683 0.661-1.817-0.052-2.531s-1.849-0.74-2.531-0.052zM27.749 17.349h-13.531c-0.932 0-1.692 0.801-1.692 1.791 0 0.991 0.76 1.797 1.692 1.797h13.531c0.933 0 1.693-0.807 1.693-1.797 0-0.989-0.76-1.791-1.693-1.791z" />
        </svg>
      </div>
    ),
    component: LeetCode,
    url: "https://leetcode.com/u/ChiragKushwaha/",
  },
  {
    id: "x",
    name: "X",
    icon: ({ className, containerClassName = "p-6 scale-[0.85]" }) => (
      <div
        className={`${className} ${containerClassName} flex items-center justify-center bg-black rounded-[22%] overflow-hidden`}
      >
        <div className="relative w-full h-full invert">
          <Image
            src="/icons/twitter-x.png"
            alt="X"
            fill
            className="object-cover"
          />
        </div>
      </div>
    ),
    component: () => <PlaceholderApp title="X" />,
    url: "https://x.com/ChiragKushwaha_",
  },
  {
    id: "github",
    name: "GitHub",
    icon: ({ className, containerClassName = "scale-[0.85]" }) => (
      <div
        className={`${className} ${containerClassName} relative flex items-center justify-center bg-white rounded-[22%] overflow-hidden`}
      >
        <Image
          src="/icons/github-v2.png"
          alt="GitHub"
          fill
          className="object-cover"
        />
      </div>
    ),
    component: () => <PlaceholderApp title="GitHub" />,
    url: "https://github.com/ChiragKushwaha",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: ({ className, containerClassName = "scale-[0.85]" }) => (
      <div
        className={`${className} ${containerClassName} relative flex items-center justify-center bg-[#0077B5] rounded-[22%] overflow-hidden`}
      >
        <Image
          src="/icons/linkedin.png"
          alt="LinkedIn"
          fill
          className="object-cover"
        />
      </div>
    ),
    component: () => <PlaceholderApp title="LinkedIn" />,
    url: "https://www.linkedin.com/in/chirag-kushwaha/",
  },
  {
    id: "topmate",
    name: "Topmate",
    icon: ({ className, containerClassName = "scale-[0.85]" }) => (
      <div
        className={`${className} ${containerClassName} relative flex items-center justify-center bg-white rounded-[22%] overflow-hidden`}
      >
        <Image
          src="/icons/topmate.png"
          alt="Topmate"
          fill
          className="object-cover"
        />
      </div>
    ),
    component: () => <PlaceholderApp title="Topmate" />,
    url: "https://topmate.io/chirag_kushwaha?utm_campaign=Page_Ready&utm_medium=popup&utm_source=topmate",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: ({ className, containerClassName = "scale-[0.85]" }) => (
      <div
        className={`${className} ${containerClassName} relative flex items-center justify-center bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-[22%] overflow-hidden`}
      >
        <Image
          src="/icons/instagram.png"
          alt="Instagram"
          fill
          className="object-cover"
        />
      </div>
    ),
    component: () => <SocialApp title="Instagram" />,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: ({ className, containerClassName = "scale-[0.85]" }) => (
      <div
        className={`${className} ${containerClassName} relative flex items-center justify-center bg-[#1877F2] rounded-[22%] overflow-hidden`}
      >
        <Image
          src="/icons/facebook.png"
          alt="Facebook"
          fill
          className="object-cover"
        />
      </div>
    ),
    component: () => <SocialApp title="Facebook" />,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: ({ className, containerClassName = "scale-[0.85]" }) => (
      <div
        className={`${className} ${containerClassName} relative flex items-center justify-center bg-black rounded-[22%] overflow-hidden`}
      >
        <Image
          src="/icons/tiktok-v4.png"
          alt="TikTok"
          fill
          className="object-cover"
        />
      </div>
    ),
    component: () => <SocialApp title="TikTok" />,
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: ({ className, containerClassName = "scale-[0.85]" }) => (
      <div
        className={`${className} ${containerClassName} relative flex items-center justify-center bg-[#FFFC00] rounded-[22%] overflow-hidden`}
      >
        <Image
          src="/icons/snapchat-v2.png"
          alt="Snapchat"
          fill
          className="object-cover"
        />
      </div>
    ),
    component: () => <SocialApp title="Snapchat" />,
  },
];

const LaunchpadItem: React.FC<{
  app: AppDef;
  onClick: () => void;
}> = ({ app, onClick }) => {
  const Icon = app.icon;

  return (
    <button
      className="flex flex-col items-center gap-4 group cursor-pointer bg-transparent border-none"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={`Launch ${app.name}`}
    >
      <div className="w-[112px] h-[112px] min-w-[112px] min-h-[112px] transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95 flex items-center justify-center">
        <Icon
          size={90}
          className="w-full h-full drop-shadow-2xl object-contain"
        />
      </div>
      <span className="text-white text-[15px] font-semibold drop-shadow-lg tracking-tight opacity-90 group-hover:opacity-100">
        {app.name}
      </span>
    </button>
  );
};

export const Launchpad: React.FC = () => {
  const { launchProcess, closeProcess, processes } = useProcessStore();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [externalLink, setExternalLink] = useState<{
    isOpen: boolean;
    url: string;
  }>({
    isOpen: false,
    url: "",
  });

  const filteredApps = useMemo(() => {
    return APPS.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAppClick = React.useCallback(
    (app: AppDef) => {
      // Handle external URLs - DON'T close launchpad yet
      if (app.url) {
        setExternalLink({ isOpen: true, url: app.url });
        return;
      }

      // Close Launchpad for non-external apps
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Close Launchpad
        onClose();
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => Math.min(filteredApps.length - 1, prev + 1));
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(0, prev - 7)); // 7 columns
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => Math.min(filteredApps.length - 1, prev + 7));
      } else if (e.key === "Enter") {
        if (selectedIndex !== -1) {
          const app = filteredApps[selectedIndex];
          if (app) handleAppClick(app);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredApps, onClose, handleAppClick]);

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
      role="dialog"
      aria-label="Application launcher"
      className="w-screen h-screen max-w-none max-h-none bg-transparent m-0 p-0 backdrop:bg-black/40 backdrop:backdrop-blur-[100px] animate-in fade-in zoom-in-95 duration-200 ease-out overflow-hidden outline-none pointer-events-auto"
      onClick={handleClose}
      onCancel={handleClose}
    >
      <div className="flex flex-col items-center w-full h-full pt-[4vh] pb-[2vh] relative">
        {/* Search Bar */}
        <div
          className="flex items-center group w-full max-w-[240px] mb-6 shrink-0 sticky top-0 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Search
            className="relative z-1 left-8 text-white/50 group-focus-within:text-white transition-colors"
            size={14}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0); // Select first result on search
            }}
            aria-label="Search applications"
            className="w-full bg-white/10 border border-white/20 rounded-[8px] pl-9 pr-3 py-1.5 text-white placeholder-white/50 text-[14px] font-light focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all text-center focus:text-left focus:placeholder-transparent shadow-lg backdrop-blur-md"
            autoFocus
          />
        </div>

        {/* App Grid - Scrollable */}
        <div className="flex-1 w-full px-[4vw] overflow-y-auto overscroll-none scrollbar-hide absolute top-0 left-0 right-0 bottom-0 pt-[100px]">
          <div className="grid grid-cols-7 gap-y-8 w-full place-items-center pb-20">
            {filteredApps.map((app, index) => (
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
      </div>

      <ExternalLinkDialog
        isOpen={externalLink.isOpen}
        onClose={() => {
          setExternalLink({ ...externalLink, isOpen: false });
          // Close Launchpad when user cancels
          const launchpadPid = processes.find((p) => p.id === "launchpad")?.pid;
          if (launchpadPid) closeProcess(launchpadPid);
        }}
        onConfirm={() => {
          window.open(externalLink.url, "_blank");
          setExternalLink({ ...externalLink, isOpen: false });
          // Close Launchpad after opening external link
          const launchpadPid = processes.find((p) => p.id === "launchpad")?.pid;
          if (launchpadPid) closeProcess(launchpadPid);
        }}
        url={externalLink.url}
      />
    </dialog>
  );
};
