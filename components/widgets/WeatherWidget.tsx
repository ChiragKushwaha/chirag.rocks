import React from "react";
import { useWeather } from "../../hooks/useWeather";

interface WeatherWidgetProps {
  size: "small" | "medium" | "large";
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ size }) => {
  const { weather } = useWeather();

  if (!weather) {
    return (
      <div className="flex items-center justify-center h-full bg-linear-to-b from-[#1e40af] to-[#3b82f6] text-white text-xs">
        Loading...
      </div>
    );
  }

  const Icon = weather.current.icon;
  const temp = Math.round(weather.current.temp);
  const high = Math.round(weather.daily.tempMax[0] || temp + 2);
  const low = Math.round(weather.daily.tempMin[0] || temp - 5);

  if (size === "small") {
    return (
      <div className="flex flex-col justify-between p-3.5 h-full bg-linear-to-b from-[#1d4ed8] to-[#3b82f6] text-white select-none shadow-inner">
        <div>
          <div className="text-[13px] font-semibold tracking-tight leading-tight">{weather.location}</div>
          <div className="text-[34px] font-light leading-none mt-1">{temp}°</div>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5">
            <Icon size={18} className="text-yellow-300 drop-shadow" />
            <span className="text-[11px] font-medium capitalize">{weather.current.description}</span>
          </div>
          <div className="text-[10px] text-white/80 font-medium">H:{high}° L:{low}°</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between p-4 h-full bg-linear-to-b from-[#1d4ed8] to-[#3b82f6] text-white select-none">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[14px] font-semibold tracking-tight">{weather.location}</div>
          <div className="text-[38px] font-light leading-none mt-1">{temp}°</div>
        </div>
        <div className="text-right">
          <Icon size={24} className="text-yellow-300 drop-shadow ml-auto mb-1" />
          <div className="text-[12px] font-medium capitalize">{weather.current.description}</div>
          <div className="text-[11px] text-white/80 font-medium">H:{high}° L:{low}°</div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 border-t border-white/20 pt-2 text-center text-[10px]">
        {weather.hourly.time.slice(0, 5).map((t, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-white/70">{t}</span>
            <span className="font-semibold my-0.5">{Math.round(weather.hourly.temp[idx])}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};
