import React from "react";
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin } from "lucide-react";

export const Weather: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-yellow-300 rounded-full blur-[80px] opacity-40" />
      <div className="absolute bottom-[-20px] left-[-20px] w-48 h-48 bg-white rounded-full blur-[60px] opacity-20" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-sm font-medium opacity-90">
          <MapPin size={16} />
          <span>Cupertino, CA</span>
        </div>
        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full backdrop-blur-md">
          Now
        </span>
      </div>

      {/* Main Weather */}
      <div className="flex flex-col items-center justify-center flex-1 z-10 mt-4">
        <Sun size={80} className="text-yellow-300 drop-shadow-lg mb-4" />
        <h1 className="text-7xl font-thin tracking-tighter">72°</h1>
        <p className="text-xl font-medium mt-2 opacity-90">Mostly Sunny</p>
        <div className="flex gap-4 mt-6 text-sm font-medium opacity-80">
          <div className="flex items-center gap-1">
            <span className="text-xs">H:</span> 76°
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">L:</span> 62°
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-3 mt-8 z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/10">
          <Wind size={18} className="opacity-70" />
          <span className="text-xs opacity-60">Wind</span>
          <span className="text-sm font-semibold">8 mph</span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/10">
          <Droplets size={18} className="opacity-70" />
          <span className="text-xs opacity-60">Humidity</span>
          <span className="text-sm font-semibold">42%</span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-white/10">
          <CloudRain size={18} className="opacity-70" />
          <span className="text-xs opacity-60">Rain</span>
          <span className="text-sm font-semibold">0%</span>
        </div>
      </div>

      {/* Forecast */}
      <div className="mt-6 z-10 bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/10">
        <h3 className="text-xs font-medium opacity-60 mb-3 uppercase tracking-wider flex items-center gap-1">
          <Cloud size={12} /> 5-Day Forecast
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { day: "Today", icon: Sun, temp: "72°", range: "62° - 76°" },
            { day: "Tue", icon: Cloud, temp: "68°", range: "58° - 70°" },
            { day: "Wed", icon: CloudRain, temp: "65°", range: "55° - 66°" },
            { day: "Thu", icon: Sun, temp: "70°", range: "60° - 72°" },
            { day: "Fri", icon: Sun, temp: "74°", range: "64° - 78°" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-sm border-b border-white/5 last:border-0 pb-2 last:pb-0"
            >
              <span className="w-12 font-medium">{item.day}</span>
              <item.icon size={16} className="opacity-80" />
              <div className="flex items-center gap-3 w-24 justify-end">
                <span className="opacity-60 text-xs">{item.range}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
