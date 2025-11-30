// config/dock.ts
export interface DockItemConfig {
  name: string;
  icon: string; // Emoji for now, replace with SVG paths later
  isOpen: boolean;
}

export const initialDockItems: DockItemConfig[] = [
  { name: "Finder", icon: "😊", isOpen: true },
  { name: "Launchpad", icon: "🚀", isOpen: false },
  { name: "Safari", icon: "safari", isOpen: false }, // Placeholder text if emoji missing
  { name: "Messages", icon: "💬", isOpen: true },
  { name: "Mail", icon: "✉️", isOpen: false },
  { name: "Maps", icon: "🗺️", isOpen: false },
  { name: "Photos", icon: "📸", isOpen: false },
  { name: "FaceTime", icon: "📹", isOpen: false },
  { name: "Calendar", icon: "📅", isOpen: false },
  { name: "Contacts", icon: "📒", isOpen: false },
  { name: "Reminders", icon: "✅", isOpen: false },
  { name: "Notes", icon: "📝", isOpen: true },
  { name: "Music", icon: "🎵", isOpen: false },
  { name: "News", icon: "📰", isOpen: false },
  { name: "TV", icon: "📺", isOpen: false },
  { name: "App Store", icon: "🅰️", isOpen: false },
  { name: "Settings", icon: "⚙️", isOpen: true },
];
