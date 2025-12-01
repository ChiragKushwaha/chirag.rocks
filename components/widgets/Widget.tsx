import React from "react";
import { useProcessStore } from "../../store/processStore";
import { Calendar } from "../../apps/Calendar";
import { Reminders } from "../../apps/Reminders";
import { Notes } from "../../apps/Notes";
import { useReminderStore } from "../../store/reminderStore";
import { CloudSun, TrendingUp } from "lucide-react";

interface WidgetProps {
  size: "small" | "medium" | "large";
  type: "calendar" | "weather" | "stocks" | "reminders" | "notes";
  title: string;
}

export const Widget: React.FC<WidgetProps> = ({ size, type, title }) => {
  const { launchProcess } = useProcessStore();
  const { reminders } = useReminderStore();

  const handleClick = () => {
    // Map widget type to app name
    let appName = "";
    let component = null;

    switch (type) {
      case "calendar":
        appName = "Calendar";
        component = <Calendar />;
        break;
      case "reminders":
        appName = "Reminders";
        component = <Reminders />;
        break;
      case "notes":
        appName = "Notes";
        component = <Notes />;
        break;
      // Weather and Stocks don't have full apps yet, maybe just open Safari or a placeholder
      case "weather":
        appName = "Weather"; // Placeholder
        break;
      case "stocks":
        appName = "Stocks"; // Placeholder
        break;
    }

    if (appName && component) {
      launchProcess(appName.toLowerCase(), appName, type, component);
    } else if (appName) {
      // Fallback for apps not implemented
      alert(`Opening ${appName}...`);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "col-span-1 h-36"; // 1x1
      case "medium":
        return "col-span-2 h-36"; // 2x1
      case "large":
        return "col-span-2 h-80"; // 2x2
      default:
        return "col-span-1 h-36";
    }
  };

  const renderContent = () => {
    switch (type) {
      case "calendar":
        const today = new Date();
        return (
          <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-[#2c2c2e] text-black dark:text-white">
            <div className="text-red-500 font-bold text-sm uppercase">
              {today.toLocaleDateString("en-US", { weekday: "long" })}
            </div>
            <div className="text-5xl font-light">{today.getDate()}</div>
          </div>
        );
      case "weather":
        return (
          <div className="flex flex-col p-4 h-full bg-gradient-to-b from-[#1e3a8a] to-[#3b82f6] text-white">
            <div className="text-sm font-medium">Cupertino</div>
            <div className="text-4xl font-light mt-1">72°</div>
            <div className="mt-auto flex items-center gap-2 text-xs">
              <CloudSun size={16} />
              <span>Partly Cloudy</span>
            </div>
            <div className="text-xs mt-1">H:76° L:62°</div>
          </div>
        );
      case "stocks":
        return (
          <div className="flex flex-col p-3 h-full bg-[#1c1c1e] text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm">Stocks</span>
              <TrendingUp size={14} className="text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-1">
                <span className="font-bold">AAPL</span>
                <div className="text-right">
                  <div>150.00</div>
                  <div className="text-green-500">+1.2%</div>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-1">
                <span className="font-bold">GOOGL</span>
                <div className="text-right">
                  <div>2800.00</div>
                  <div className="text-red-500">-0.5%</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "reminders":
        const dueReminders = reminders.slice(0, 3);
        return (
          <div className="flex flex-col p-3 h-full bg-white dark:bg-[#2c2c2e] text-black dark:text-white">
            <div className="font-bold text-sm mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Reminders
            </div>
            <div className="space-y-2 overflow-hidden">
              {dueReminders.length === 0 ? (
                <div className="text-xs text-gray-400">No reminders</div>
              ) : (
                dueReminders.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-3 h-3 rounded-full border ${
                        r.completed
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-400"
                      }`}
                    />
                    <span
                      className={
                        r.completed ? "line-through text-gray-400" : ""
                      }
                    >
                      {r.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case "notes":
        return (
          <div className="flex flex-col p-3 h-full bg-[#fef9c3] text-gray-800 font-serif">
            <div className="font-bold text-sm mb-1">Notes</div>
            <div className="text-xs leading-relaxed overflow-hidden">
              Buy milk, eggs, and bread.
              <br />
              Call mom at 5pm.
              <br />
              Meeting with team tomorrow.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        ${getSizeClasses()}
        rounded-2xl overflow-hidden shadow-lg cursor-pointer
        transition-transform hover:scale-[1.02] active:scale-95
        bg-white/50 dark:bg-black/50 backdrop-blur-md
      `}
    >
      {renderContent()}
    </div>
  );
};
