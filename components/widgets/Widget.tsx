import React from "react";
import { useProcessStore } from "../../store/processStore";
import dynamic from "next/dynamic";
import { CalendarWidget } from "./CalendarWidget";
import { WeatherWidget } from "./WeatherWidget";
import { StocksWidget } from "./StocksWidget";
import { RemindersWidget } from "./RemindersWidget";
import { NotesWidget } from "./NotesWidget";

const Calendar = dynamic(() => import("../../apps/Calendar").then((m) => m.Calendar));
const Reminders = dynamic(() => import("../../apps/Reminders").then((m) => m.Reminders));
const Notes = dynamic(() => import("../../apps/Notes").then((m) => m.Notes));
const Weather = dynamic(() => import("../../apps/Weather").then((m) => m.Weather));
const Stocks = dynamic(() => import("../../apps/Stocks").then((m) => m.Stocks));

interface WidgetProps {
  size: "small" | "medium" | "large";
  type: "calendar" | "weather" | "stocks" | "reminders" | "notes";
  title?: string;
}

export const Widget: React.FC<WidgetProps> = ({ size, type }) => {
  const { launchProcess } = useProcessStore();

  const handleClick = () => {
    switch (type) {
      case "calendar":
        launchProcess("calendar", "Calendar", "calendar", <Calendar />);
        break;
      case "weather":
        launchProcess("weather", "Weather", "weather", <Weather />);
        break;
      case "stocks":
        launchProcess("stocks", "Stocks", "stocks", <Stocks />);
        break;
      case "reminders":
        launchProcess("reminders", "Reminders", "reminders", <Reminders />);
        break;
      case "notes":
        launchProcess("notes", "Notes", "notes", <Notes />);
        break;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "col-span-1 h-[155px]";
      case "medium":
        return "col-span-2 h-[155px]";
      case "large":
        return "col-span-2 h-[320px]";
      default:
        return "col-span-1 h-[155px]";
    }
  };

  const renderContent = () => {
    switch (type) {
      case "calendar":
        return <CalendarWidget size={size} />;
      case "weather":
        return <WeatherWidget size={size} />;
      case "stocks":
        return <StocksWidget size={size} />;
      case "reminders":
        return <RemindersWidget size={size} />;
      case "notes":
        return <NotesWidget size={size} />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        ${getSizeClasses()}
        rounded-[22px] overflow-hidden shadow-lg cursor-pointer
        transition-all duration-200 hover:scale-[1.015] active:scale-[0.98]
        border border-black/5 dark:border-white/10 select-none
      `}
    >
      {renderContent()}
    </div>
  );
};
