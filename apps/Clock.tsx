import React, { useState, useEffect } from "react";
import { Plus, Globe, AlarmClock, Timer, Hourglass } from "lucide-react";

export const Clock: React.FC = () => {
  const [activeTab, setActiveTab] = useState("World Clock");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getHandRotation = (date: Date) => {
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    return {
      second: seconds * 6,
      minute: minutes * 6 + seconds * 0.1,
      hour: (hours % 12) * 30 + minutes * 0.5,
    };
  };

  const hands = getHandRotation(time);

  return (
    <div className="w-full h-full bg-[#1C1C1E] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 bg-[#2C2C2E] border-b border-black/20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>

        <div className="flex bg-[#1C1C1E] rounded-lg p-1 gap-1">
          {[
            { name: "World Clock", icon: Globe },
            { name: "Alarms", icon: AlarmClock },
            { name: "Stopwatch", icon: Timer },
            { name: "Timers", icon: Hourglass },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.name
                  ? "bg-[#3A3A3C] text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <button
          className="w-8 h-8 rounded-full bg-[#3A3A3C] flex items-center justify-center hover:bg-[#48484A] transition-colors"
          aria-label="Add clock"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 relative flex flex-col">
        {/* Map Area */}
        <div className="flex-1 bg-black relative overflow-hidden">
          {/* World Map SVG (Simplified) */}
          <svg
            className="w-full h-full opacity-30"
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M150,100 Q200,50 250,100 T350,150 T450,100 T550,150 T650,100 T750,150 T850,100 T950,150 V400 H50 V150 Z"
            />
            {/* Rough Continents */}
            <path
              fill="#3A3A3C"
              d="M50,100 Q100,50 150,100 T200,200 T100,300 T50,200 Z M300,100 Q400,50 500,100 T550,250 T450,400 T350,300 Z M600,100 Q700,50 800,100 T850,200 T750,300 T650,200 Z M850,250 Q900,200 950,250 T900,350 T850,250 Z"
            />
          </svg>

          {/* Day/Night Curve (Sine Wave) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 H1000 V500 H0 Z"
              fill="none"
              stroke="white"
              strokeOpacity="0.1"
            />
            <path
              d="M0,500 V250 Q250,0 500,250 T1000,250 V500 Z"
              fill="black"
              fillOpacity="0.4"
            />
            <path
              d="M0,250 Q250,0 500,250 T1000,250"
              fill="none"
              stroke="#FFA500"
              strokeWidth="2"
              strokeOpacity="0.5"
            />
          </svg>

          {/* Grid Lines */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-white/5 last:border-0"
              />
            ))}
          </div>

          {/* Location Marker (New Delhi) */}
          <div className="absolute top-[45%] left-[70%] flex flex-col items-center group cursor-pointer">
            <div className="w-2 h-2 bg-[#FF9F0A] rounded-full shadow-[0_0_10px_#FF9F0A]" />
            <div className="mt-1 text-xs font-medium text-white drop-shadow-md">
              New Delhi
            </div>
            <div className="text-[10px] text-white/70">
              {time.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="h-48 bg-[#1C1C1E] border-t border-white/10 p-6 flex gap-6 overflow-x-auto">
          {/* Clock Widget */}
          <div className="w-32 flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-28 h-28 bg-[#2C2C2E] rounded-full relative shadow-inner border border-white/5">
              {/* Clock Face */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-full flex justify-center pt-1"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                >
                  <div className="w-0.5 h-1.5 bg-white/40" />
                </div>
              ))}
              {/* Numbers */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
                // Adjust position for numbers
                return (
                  <div
                    key={num}
                    className="absolute w-full h-full flex justify-center items-center text-[10px] font-medium text-white/80"
                    style={{
                      transform: `rotate(${i * 30}deg)`,
                    }}
                  >
                    <span
                      style={{
                        transform: `rotate(-${i * 30}deg) translateY(-38px)`,
                      }}
                    >
                      {num}
                    </span>
                  </div>
                );
              })}

              {/* Hands */}
              <div
                className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-white origin-bottom rounded-full"
                style={{
                  transform: `translate(-50%, -100%) rotate(${hands.minute}deg)`,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 w-1 h-5 bg-white origin-bottom rounded-full"
                style={{
                  transform: `translate(-50%, -100%) rotate(${hands.hour}deg)`,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 w-0.5 h-9 bg-[#FF9F0A] origin-bottom rounded-full"
                style={{
                  transform: `translate(-50%, -100%) rotate(${hands.second}deg)`,
                }}
              />
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-[#FF9F0A] rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">New Delhi</div>
              <div className="text-xs text-white/50">Today, +0 HRS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
