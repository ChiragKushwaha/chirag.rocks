import React from "react";
import {
  Airplay,
  Clock,
  Download,
  FileText,
  Folder,
  HardDrive,
  Home,
  Image,
  LayoutGrid,
  Monitor,
} from "lucide-react";
import { MacOSTableRow } from "../../components/ui/MacOSDesignSystem"; // New import

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

import { useSystemStore } from "../../store/systemStore";

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
}) => {
  const { user } = useSystemStore();
  const userName = user?.name || "Guest";
  const userHome = `/Users/${userName}`;

  const menuItems = [
    {
      title: "Favorites",
      items: [
        { name: "AirDrop", icon: Airplay, path: "/AirDrop" },
        { name: "Recents", icon: Clock, path: "/Recents" },
        { name: "Applications", icon: LayoutGrid, path: "/Applications" },
        { name: "Desktop", icon: Monitor, path: `${userHome}/Desktop` },
        { name: "Documents", icon: FileText, path: `${userHome}/Documents` },
        { name: "Downloads", icon: Download, path: `${userHome}/Downloads` },
        { name: "Pictures", icon: Image, path: `${userHome}/Pictures` },
        { name: "Home", icon: Home, path: userHome },
      ],
    },
    {
      title: "Locations",
      items: [
        { name: "Macintosh HD", icon: HardDrive, path: "/" },
        {
          name: "iCloud Drive",
          icon: Folder,
          path: `${userHome}/Library/Mobile Documents`,
        },
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-transparent text-[13px] overflow-y-auto select-none">
      {menuItems.map((section, idx) => (
        <div key={idx} className="mb-4 px-2">
          <h3 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 px-3 opacity-80">
            {section.title}
          </h3>
          <ul>
            {section.items.map((item) => {
              const isActive = currentPath === item.path;
              // Use Icon component dynamically
              const Icon = item.icon;

              return (
                <li key={item.name} onClick={() => onNavigate(item.path)}>
                  <MacOSTableRow
                    label={item.name}
                    selected={isActive}
                    icon={
                      <Icon
                        size={16}
                        className={isActive ? "text-white" : "text-[#007AFF]"}
                        strokeWidth={2}
                      />
                    }
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};
