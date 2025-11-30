import React, { useState, useEffect } from "react";
import { Apple, Wifi, Battery, Search, Sliders } from "lucide-react";
import { MacOSTypography } from "./design-system/MacOSTypography";

interface MenuItem {
  label: string;
  items?: MenuItem[];
  onClick?: () => void;
}

interface MacOSMenuBarProps {
  appName?: string;
  menus?: MenuItem[];
  className?: string;
}

export const MacOSMenuBar: React.FC<MacOSMenuBarProps> = ({
  appName = "Finder",
  menus = [],
  className = "",
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date
      .toLocaleTimeString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
      .replace(/,/g, "");
  };

  return (
    <div
      className={`h-[24px] w-full bg-[var(--menu-bar-background)]/90 backdrop-blur-xl flex items-center justify-between px-4 select-none z-[9999] text-[13px] font-medium text-white shadow-sm ${className}`}
    >
      {/* Left Side: Apple Logo + App Menus */}
      <div className="flex items-center gap-4">
        <button className="hover:opacity-70 transition-opacity">
          <Apple size={14} fill="currentColor" />
        </button>

        <button className="font-bold hover:opacity-70 transition-opacity">
          {appName}
        </button>

        {menus.map((menu) => (
          <button
            key={menu.label}
            className="font-normal hover:opacity-70 transition-opacity hidden sm:block"
          >
            {menu.label}
          </button>
        ))}
      </div>

      {/* Right Side: Status Items */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 opacity-90">
          <Battery size={16} />
          <Wifi size={16} />
          <Search size={14} />
          <Sliders size={16} /> {/* Placeholder for Control Center icon */}
        </div>

        <div className="font-medium tabular-nums">{formatTime(time)}</div>
      </div>
    </div>
  );
};
