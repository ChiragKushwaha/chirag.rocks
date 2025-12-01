import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getWeatherInfo, WeatherData } from "../lib/weatherApi";
import { MapPin } from "lucide-react";

interface WeatherDropdownProps {
  weather: WeatherData;
  isOpen: boolean;
  onClose: () => void;
  toggleRef: React.RefObject<HTMLElement | null>;
}

export const WeatherDropdown: React.FC<WeatherDropdownProps> = ({
  weather,
  isOpen,
  onClose,
  toggleRef,
}) => {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClick);
    }
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose, toggleRef]);

  const [right, setRight] = useState(10);

  useEffect(() => {
    if (isOpen && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setRight(window.innerWidth - rect.right);
    }
  }, [isOpen, toggleRef]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={ref}
      className="fixed top-8 z-9000 w-80 bg-black/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden text-white font-sans animate-in fade-in zoom-in-95 duration-200 origin-top-right"
      style={{ right }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-start bg-linear-to-b from-white/5 to-transparent">
        <div>
          <div className="flex items-center gap-1 text-lg font-semibold">
            {weather.location} <MapPin size={14} className="opacity-70" />
          </div>
          <div className="text-6xl font-thin tracking-tighter mt-1">
            {weather.current.temp}°
          </div>
        </div>
        <div className="flex flex-col items-end text-right">
          <weather.current.icon size={32} className="text-yellow-400 mb-1" />
          <div className="text-sm font-medium">
            {weather.current.description}
          </div>
          <div className="text-xs opacity-70 mt-1">
            H:{Math.round(weather.daily.tempMax[0])}° L:
            {Math.round(weather.daily.tempMin[0])}°
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between text-xs font-semibold opacity-60 mb-3 uppercase tracking-wider">
          {weather.hourly.time.slice(0, 5).map((time) => {
            const date = new Date(time);
            const hour = date.getHours();
            const isNow = date.getHours() === new Date().getHours();
            return (
              <span key={time}>
                {isNow
                  ? "Now"
                  : `${hour % 12 || 12}${hour >= 12 ? "PM" : "AM"}`}
              </span>
            );
          })}
        </div>
        <div className="flex justify-between items-center">
          {weather.hourly.time.slice(0, 5).map((time, i) => {
            const info = getWeatherInfo(weather.hourly.code[i], true); // Assuming day for simplicity or calculate based on time
            const Icon = info.icon;
            return (
              <div key={time} className="flex flex-col items-center gap-2">
                <Icon size={20} className="opacity-90" />
                <span className="text-sm font-medium">
                  {Math.round(weather.hourly.temp[i])}°
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="p-2">
        {weather.daily.time.slice(0, 3).map((time, i) => {
          const date = new Date(time);
          const dayName =
            i === 0
              ? "Today"
              : date.toLocaleDateString("en-US", { weekday: "long" });
          const info = getWeatherInfo(weather.daily.code[i]);
          const Icon = info.icon;

          return (
            <div
              key={time}
              className="flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <span className="w-24 font-medium">{dayName}</span>
              <Icon size={18} className="opacity-80" />
              <div className="flex items-center gap-3 w-24 justify-end">
                <span className="opacity-60">
                  {Math.round(weather.daily.tempMin[i])}°
                </span>
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 bg-linear-to-b from-blue-500/20 to-blue-600/20 rounded-full"
                    style={{ left: "10%", right: "10%" }}
                  />
                </div>
                <span className="font-medium">
                  {Math.round(weather.daily.tempMax[i])}°
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2 border-t border-white/10 text-xs opacity-50 hover:bg-white/5 cursor-pointer transition-colors">
        Open Weather
      </div>
    </div>,
    document.body
  );
};
