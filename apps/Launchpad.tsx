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
import { CalendarIcon } from "../components/icons/CalendarIcon";
import { WeatherIcon } from "../components/icons/WeatherIcon";
import { ClockIcon } from "../components/icons/ClockIcon";
import { useAsset } from "../components/hooks/useIconManager";
import dynamic from "next/dynamic";

const Finder = dynamic(() =>
  import("./Finder/Finder").then((mod) => mod.Finder)
);
const Safari = dynamic(() => import("./Safari").then((mod) => mod.Safari));
const Messages = dynamic(() =>
  import("./Messages").then((mod) => mod.Messages)
);
const Mail = dynamic(() => import("./Mail").then((mod) => mod.Mail));
const Maps = dynamic(() => import("./Maps").then((mod) => mod.Maps));
const FaceTime = dynamic(() =>
  import("./FaceTime").then((mod) => mod.FaceTime)
);
const Calendar = dynamic(() =>
  import("./Calendar").then((mod) => mod.Calendar)
);
const Contacts = dynamic(() =>
  import("./Contacts").then((mod) => mod.Contacts)
);
const Reminders = dynamic(() =>
  import("./Reminders").then((mod) => mod.Reminders)
);
const Notes = dynamic(() => import("./Notes").then((mod) => mod.Notes));
const Music = dynamic(() => import("./Music").then((mod) => mod.Music));
const TV = dynamic(() => import("./TV").then((mod) => mod.TV));
const News = dynamic(() => import("./News").then((mod) => mod.News));
const AppStore = dynamic(() =>
  import("./AppStore").then((mod) => mod.AppStore)
);
const SystemSettings = dynamic(() =>
  import("./SystemSettings").then((mod) => mod.SystemSettings)
);
const Freeform = dynamic(() =>
  import("./Freeform").then((mod) => mod.Freeform)
);
const Terminal = dynamic(() =>
  import("./Terminal").then((mod) => mod.Terminal)
);
const Calculator = dynamic(() =>
  import("./Calculator").then((mod) => mod.Calculator)
);
const Trash = dynamic(() => import("./Trash").then((mod) => mod.Trash));
const Photos = dynamic(() => import("./Photos").then((mod) => mod.Photos));
const Weather = dynamic(() => import("./Weather").then((mod) => mod.Weather));
const Clock = dynamic(() => import("./Clock").then((mod) => mod.Clock));
const Chess = dynamic(() => import("./Chess").then((mod) => mod.Chess));
const Stocks = dynamic(() => import("./Stocks").then((mod) => mod.Stocks));
const VSCode = dynamic(() => import("./VSCode").then((mod) => mod.VSCode));
const LeetCode = dynamic(() =>
  import("./LeetCode").then((mod) => mod.LeetCode)
);

const CachedIcon = ({
  src,
  alt,
  className,
  imageClassName = "object-contain drop-shadow-lg",
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}) => {
  const url = useAsset(src);
  return (
    <div className={`${className} relative`}>
      {url && (
        <Image
          src={url}
          alt={alt}
          fill
          className={imageClassName}
          unoptimized
        />
      )}
    </div>
  );
};

const PDFViewer = dynamic(
  () => import("./PDFViewer").then((mod) => mod.PDFViewer),
  { ssr: false }
);
import { ChessIcon } from "../components/icons/ChessIcon";
import { StocksIcon } from "../components/icons/StocksIcon";
import { BooksIcon } from "../components/icons/BooksIcon";
import { PlaceholderApp } from "./PlaceholderApp";
import { SocialApp } from "./SocialApp";
import { ExternalLinkDialog } from "../components/ExternalLinkDialog";

const CachedIconWithBackground = ({
  src,
  alt,
  className,
  containerClassName,
  bgClassName = "bg-white",
}: {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  bgClassName?: string;
}) => {
  const url = useAsset(src);
  return (
    <div
      className={`${className} ${containerClassName} relative flex items-center justify-center rounded-[22%] overflow-hidden ${bgClassName}`}
    >
      {url && (
        <Image src={url} alt={alt} fill className="object-cover" unoptimized />
      )}
    </div>
  );
};

const VSCodeIcon = ({
  className,
  imageClassName = "p-2 rounded-3xl scale-[0.75]",
}: {
  className?: string;
  imageClassName?: string;
}) => {
  const url = useAsset("/icons/vscode.webp");
  return (
    <div className={`${className} relative`}>
      {url && (
        <Image
          src={url}
          alt="VS Code"
          fill
          className={`object-contain drop-shadow-lg bg-white ${imageClassName}`}
          unoptimized
        />
      )}
    </div>
  );
};

const XIcon = ({
  className,
  containerClassName = "p-6 scale-[0.85]",
}: {
  className?: string;
  containerClassName?: string;
}) => {
  const url = useAsset("/icons/twitter-x.webp");
  return (
    <div
      className={`${className} ${containerClassName} flex items-center justify-center bg-black rounded-[22%] overflow-hidden`}
    >
      <div className="relative w-full h-full invert">
        {url && (
          <Image src={url} alt="X" fill className="object-cover" unoptimized />
        )}
      </div>
    </div>
  );
};

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
      <CachedIcon src="/icons/finder.webp" alt="Finder" className={className} />
    ),
    component: Finder,
  },
  {
    id: "safari",
    name: "Safari",
    icon: ({ className }) => (
      <CachedIcon src="/icons/safari.webp" alt="Safari" className={className} />
    ),
    component: Safari,
  },
  {
    id: "messages",
    name: "Messages",
    icon: ({ className }) => (
      <CachedIcon
        src="/icons/messages.webp"
        alt="Messages"
        className={className}
      />
    ),
    component: Messages,
  },
  {
    id: "mail",
    name: "Mail",
    icon: ({ className }) => (
      <CachedIcon src="/icons/mail.webp" alt="Mail" className={className} />
    ),
    component: Mail,
  },
  {
    id: "maps",
    name: "Maps",
    icon: ({ className }) => (
      <CachedIcon src="/icons/maps.webp" alt="Maps" className={className} />
    ),
    component: Maps,
  },
  {
    id: "photos",
    name: "Photos",
    icon: ({ className }) => (
      <CachedIcon src="/icons/photos.webp" alt="Photos" className={className} />
    ),
    component: Photos,
  },
  {
    id: "facetime",
    name: "FaceTime",
    icon: ({ className }) => (
      <CachedIcon
        src="/icons/facetime.webp"
        alt="FaceTime"
        className={className}
      />
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
      <CachedIcon
        src="/icons/contacts.webp"
        alt="Contacts"
        className={className}
      />
    ),
    component: Contacts,
  },
  {
    id: "reminders",
    name: "Reminders",
    icon: ({ className }) => (
      <CachedIcon
        src="/icons/reminders.webp"
        alt="Reminders"
        className={className}
      />
    ),
    component: Reminders,
  },
  {
    id: "notes",
    name: "Notes",
    icon: ({ className }) => (
      <CachedIcon src="/icons/notes.webp" alt="Notes" className={className} />
    ),
    component: Notes,
  },
  {
    id: "music",
    name: "Music",
    icon: ({ className }) => (
      <CachedIcon src="/icons/music.webp" alt="Music" className={className} />
    ),
    component: Music,
  },
  {
    id: "podcasts",
    name: "Podcasts",
    icon: ({ className }) => (
      <CachedIcon
        src="/icons/podcasts.webp"
        alt="Podcasts"
        className={className}
      />
    ),
    component: () => <PlaceholderApp title="Podcasts" />,
  },
  {
    id: "tv",
    name: "TV",
    icon: ({ className }) => (
      <CachedIcon src="/icons/tv.webp" alt="TV" className={className} />
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
      <CachedIcon src="/icons/news.webp" alt="News" className={className} />
    ),
    component: News,
  },
  {
    id: "appstore",
    name: "App Store",
    icon: ({ className }) => (
      <CachedIcon
        src="/icons/appstore.webp"
        alt="App Store"
        className={className}
      />
    ),
    component: AppStore,
  },
  {
    id: "settings",
    name: "System Settings",
    icon: ({ className }) => (
      <CachedIcon
        src="/icons/settings.webp"
        alt="System Settings"
        className={className}
      />
    ),
    component: SystemSettings,
  },
  {
    id: "freeform",
    name: "Freeform",
    icon: ({ className }) => (
      <CachedIcon
        src="/icons/freeform.webp"
        alt="Freeform"
        className={className}
      />
    ),
    component: Freeform,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: ({ className }) => (
      <CachedIcon
        src="/icons/terminal.webp"
        alt="Terminal"
        className={className}
      />
    ),
    component: Terminal,
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: ({ className }) => (
      <CachedIcon
        src="/icons/calculator.webp"
        alt="Calculator"
        className={className}
      />
    ),
    component: Calculator,
  },
  {
    id: "trash",
    name: "Trash",
    icon: ({ className }) => (
      <CachedIcon src="/icons/trash.webp" alt="Trash" className={className} />
    ),
    component: Trash,
  },
  {
    id: "preview",
    name: "Preview",
    icon: ({ className }) => (
      <CachedIcon
        src="/icons/preview.webp"
        alt="Preview"
        className={className}
      />
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
    icon: VSCodeIcon,
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
    icon: XIcon,
    component: () => <PlaceholderApp title="X" />,
    url: "https://x.com/ChiragKushwaha_",
  },
  {
    id: "github",
    name: "GitHub",
    icon: (props) => (
      <CachedIconWithBackground
        {...props}
        src="/icons/github-v2.webp"
        alt="GitHub"
        bgClassName="bg-white"
      />
    ),
    component: () => <PlaceholderApp title="GitHub" />,
    url: "https://github.com/ChiragKushwaha",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: (props) => (
      <CachedIconWithBackground
        {...props}
        src="/icons/linkedin.webp"
        alt="LinkedIn"
        bgClassName="bg-[#0077B5]"
      />
    ),
    component: () => <PlaceholderApp title="LinkedIn" />,
    url: "https://www.linkedin.com/in/chirag-kushwaha/",
  },
  {
    id: "topmate",
    name: "Topmate",
    icon: (props) => (
      <CachedIconWithBackground
        {...props}
        src="/icons/topmate.webp"
        alt="Topmate"
        bgClassName="bg-white"
      />
    ),
    component: () => <PlaceholderApp title="Topmate" />,
    url: "https://topmate.io/chirag_kushwaha?utm_campaign=Page_Ready&utm_medium=popup&utm_source=topmate",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: (props) => (
      <CachedIconWithBackground
        {...props}
        src="/icons/instagram.webp"
        alt="Instagram"
        bgClassName="bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]"
      />
    ),
    component: () => <SocialApp title="Instagram" />,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: (props) => (
      <CachedIconWithBackground
        {...props}
        src="/icons/facebook.webp"
        alt="Facebook"
        bgClassName="bg-[#1877F2]"
      />
    ),
    component: () => <SocialApp title="Facebook" />,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: (props) => (
      <CachedIconWithBackground
        {...props}
        src="/icons/tiktok-v4.webp"
        alt="TikTok"
        bgClassName="bg-black"
      />
    ),
    component: () => <SocialApp title="TikTok" />,
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: (props) => (
      <CachedIconWithBackground
        {...props}
        src="/icons/snapchat-v2.webp"
        alt="Snapchat"
        bgClassName="bg-[#FFFC00]"
      />
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
      <div className="flex flex-col items-center w-full h-full pt-[4vh] pb-[2vh] relative select-none">
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
            aria-autocomplete="list"
            aria-controls="launchpad-grid"
            aria-activedescendant={
              selectedIndex !== -1 && filteredApps[selectedIndex]
                ? `launchpad-item-${filteredApps[selectedIndex].id}`
                : undefined
            }
            className="w-full bg-white/10 border border-white/20 rounded-[8px] pl-9 pr-3 py-1.5 text-white placeholder-white/50 text-[14px] font-light focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all text-center focus:text-left focus:placeholder-transparent shadow-lg backdrop-blur-md"
            autoFocus
          />
        </div>

        {/* App Grid - Scrollable */}
        <div className="flex-1 w-full px-[4vw] overflow-y-auto overscroll-none scrollbar-hide absolute top-0 left-0 right-0 bottom-0 pt-[100px]">
          <ul
            id="launchpad-grid"
            role="listbox"
            aria-label="Applications"
            className="grid grid-cols-7 gap-y-8 w-full place-items-center pb-20 m-0 p-0 list-none"
          >
            {filteredApps.map((app, index) => (
              <li
                id={`launchpad-item-${app.id}`}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={(e) => e.stopPropagation()}
                key={app.id}
                className={`relative group rounded-xl transition-all duration-200 ${
                  index === selectedIndex
                    ? "bg-white/10 ring-1 ring-white/20"
                    : ""
                }`}
              >
                <LaunchpadItem app={app} onClick={() => handleAppClick(app)} />
              </li>
            ))}
          </ul>
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
