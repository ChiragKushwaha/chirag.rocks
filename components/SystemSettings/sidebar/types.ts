import React from "react";
import {
  Wifi,
  Bluetooth,
  Info,
  Moon,
  Layout,
  Monitor,
  Image as ImageIcon,
  Battery,
  Lock,
  Keyboard,
  Mouse,
  HardDrive,
  Search,
  Volume2,
  Bell,
  Hourglass,
  Printer,
  User,
  Fingerprint,
  Shield,
  Film,
  Focus,
  Network,
} from "lucide-react";

export interface SettingItem {
  id: string;
  icon: React.ElementType;
  color: string;
  group: "network" | "personal" | "security" | "hardware";
}

export const SETTING_ITEMS: SettingItem[] = [
  // Network
  { id: "Wi-Fi", icon: Wifi, color: "#007AFF", group: "network" },
  { id: "Bluetooth", icon: Bluetooth, color: "#007AFF", group: "network" },
  { id: "Network", icon: Network, color: "#007AFF", group: "network" },

  // Personalization
  { id: "General", icon: Info, color: "#8E8E93", group: "personal" },
  { id: "Appearance", icon: Moon, color: "#636366", group: "personal" },
  { id: "Accessibility", icon: Shield, color: "#007AFF", group: "personal" },
  { id: "Menu Bar", icon: Layout, color: "#8E8E93", group: "personal" },
  { id: "Desktop & Dock", icon: Monitor, color: "#636366", group: "personal" },
  { id: "Displays", icon: Monitor, color: "#007AFF", group: "personal" },
  { id: "Spotlight", icon: Search, color: "#5856D6", group: "personal" },
  { id: "Wallpaper", icon: ImageIcon, color: "#32ADE6", group: "personal" },
  { id: "Screen Saver", icon: Film, color: "#32ADE6", group: "personal" },
  { id: "Battery", icon: Battery, color: "#34C759", group: "personal" },
  { id: "Sound", icon: Volume2, color: "#FF2D55", group: "personal" },
  { id: "Notifications", icon: Bell, color: "#FF3B30", group: "personal" },
  { id: "Focus", icon: Focus, color: "#5856D6", group: "personal" },
  { id: "Screen Time", icon: Hourglass, color: "#5856D6", group: "personal" },

  // Privacy & Security
  { id: "Privacy & Security", icon: Lock, color: "#007AFF", group: "security" },
  { id: "Lock Screen", icon: Lock, color: "#8E8E93", group: "security" },
  { id: "Touch ID & Password", icon: Fingerprint, color: "#8E8E93", group: "security" },
  { id: "Users & Groups", icon: User, color: "#8E8E93", group: "security" },

  // Hardware
  { id: "Keyboard", icon: Keyboard, color: "#8E8E93", group: "hardware" },
  { id: "Trackpad", icon: Mouse, color: "#8E8E93", group: "hardware" },
  { id: "Printers & Scanners", icon: Printer, color: "#8E8E93", group: "hardware" },
  { id: "Storage", icon: HardDrive, color: "#FF9500", group: "hardware" },
];
