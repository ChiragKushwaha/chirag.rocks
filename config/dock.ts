// config/dock.ts
export interface DockItemConfig {
  name: string;
  icon: string; // Emoji for now, replace with SVG paths later
  isOpen: boolean;
}

export const initialDockItems: DockItemConfig[] = [
  { name: "Finder", icon: "finder", isOpen: true },
  { name: "Launchpad", icon: "apps", isOpen: false }, // Will fallback to emoji/generic if missing
  { name: "Safari", icon: "safari", isOpen: false },
  { name: "Messages", icon: "messages", isOpen: true },
  { name: "Mail", icon: "mail", isOpen: false },
  { name: "Maps", icon: "maps", isOpen: false },
  { name: "Photos", icon: "photos", isOpen: false },
  { name: "FaceTime", icon: "facetime", isOpen: false },
  { name: "Calendar", icon: "calendar", isOpen: false }, // Will fallback
  { name: "Contacts", icon: "contacts", isOpen: false },
  { name: "Reminders", icon: "reminders", isOpen: false },
  { name: "Notes", icon: "notes", isOpen: true },
  { name: "Freeform", icon: "freeform", isOpen: false },
  { name: "TV", icon: "tv", isOpen: false },
  { name: "Music", icon: "music", isOpen: false },
  { name: "News", icon: "news", isOpen: false },
  { name: "App Store", icon: "app_store", isOpen: false },
  { name: "System Settings", icon: "settings", isOpen: true },
  { name: "Terminal", icon: "terminal", isOpen: false },
  { name: "Calculator", icon: "calculator", isOpen: false },
];
