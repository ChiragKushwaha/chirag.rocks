import React from "react";
import { useProcessStore } from "../../store/processStore";
import { Calendar } from "../../apps/Calendar";
import { Reminders } from "../../apps/Reminders";
import { Notes } from "../../apps/Notes";
import { useReminderStore } from "../../store/reminderStore";
import { TrendingUp } from "lucide-react";
import { useWeather } from "../../hooks/useWeather";
import { Weather } from "../../apps/Weather";
import { Stocks } from "../../apps/Stocks";
import { useStockStore } from "../../store/stockStore";
import { useTranslations, useLocale } from "next-intl";
interface WidgetProps {
  size: "small" | "medium" | "large";
  type: "calendar" | "weather" | "stocks" | "reminders" | "notes";
  title: string;
}

export const Widget: React.FC<WidgetProps> = ({ size, type }) => {
  const t = useTranslations("Widgets");
  const locale = useLocale();
  const { launchProcess } = useProcessStore();
  const { reminders } = useReminderStore();
  const { weather } = useWeather();
  const { stocks, fetchStocks } = useStockStore();
  const stockData = stocks.find((s) => s.symbol === "AAPL") || null;

  React.useEffect(() => {
    if (type === "stocks") {
      fetchStocks();
    }
  }, [type, fetchStocks]);

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
        appName = "Weather";
        component = <Weather />;
        break;
      case "stocks":
        appName = "Stocks";
        component = <Stocks />;
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
              {today.toLocaleDateString(locale, { weekday: "long" })}
            </div>
            <div className="text-5xl font-light">{today.getDate()}</div>
          </div>
        );
      case "weather":
        if (!weather)
          return <div className="p-4 text-white">{t("Loading")}</div>;
        return (
          <div className="flex flex-col p-4 h-full bg-linear-to-b from-[#1e3a8a] to-[#3b82f6] text-white">
            <div className="text-sm font-medium">{weather.location}</div>
            <div className="text-4xl font-light mt-1">
              {weather.current.temp}°
            </div>
            <div className="mt-auto flex items-center gap-2 text-xs">
              <weather.current.icon size={16} />
              <span>{weather.current.description}</span>
            </div>
            <div className="text-xs mt-1">
              H:{Math.round(weather.daily.tempMax[0])}° L:
              {Math.round(weather.daily.tempMin[0])}°
            </div>
          </div>
        );
      case "stocks":
        if (!stockData)
          return <div className="p-4 text-white">{t("Loading")}</div>;
        const isPositive = stockData.change >= 0;
        return (
          <div className="flex flex-col p-3 h-full bg-[#1c1c1e] text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm">{t("Stocks.Title")}</span>
              <TrendingUp
                size={14}
                className={isPositive ? "text-green-500" : "text-red-500"}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-1">
                <span className="font-bold">{stockData.symbol}</span>
                <div className="text-right">
                  <div>{stockData.price.toFixed(2)}</div>
                  <div
                    className={isPositive ? "text-green-500" : "text-red-500"}
                  >
                    {isPositive ? "+" : ""}
                    {stockData.changePercent.toFixed(2)}%
                  </div>
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
              {t("Reminders.Title")}
            </div>
            <div className="space-y-2 overflow-hidden">
              {dueReminders.length === 0 ? (
                <div className="text-xs text-gray-400">
                  {t("Reminders.NoReminders")}
                </div>
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
            <div className="font-bold text-sm mb-1">{t("Notes.Title")}</div>
            <div
              className="text-xs leading-relaxed overflow-hidden"
              dangerouslySetInnerHTML={{ __html: t.raw("Notes.Content") }} // Allow HTML for <br/>
            />
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
