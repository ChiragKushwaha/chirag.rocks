import React, { useState } from "react";
import { Widget } from "../widgets/Widget";
import { MinusCircle, PlusCircle, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

interface WidgetConfig {
  id: string;
  size: "small" | "medium" | "large";
  type: "calendar" | "weather" | "stocks" | "reminders" | "notes";
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "cal", size: "small", type: "calendar" },
  { id: "wth", size: "small", type: "weather" },
  { id: "stk", size: "medium", type: "stocks" },
  { id: "rem", size: "medium", type: "reminders" },
];

export const WidgetGrid: React.FC = () => {
  const t = useTranslations("NotificationCenter");
  const [isEditing, setIsEditing] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState<WidgetConfig[]>(DEFAULT_WIDGETS);

  const removeWidget = (id: string) => {
    setActiveWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const addWidget = (widget: WidgetConfig) => {
    setActiveWidgets((prev) => [...prev, widget]);
  };

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3.5">
        {activeWidgets.map((w) => (
          <div
            key={w.id}
            className={`relative ${
              w.size === "medium" ? "col-span-2" : "col-span-1"
            } ${isEditing ? "animate-pulse" : ""}`}
          >
            {isEditing && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeWidget(w.id);
                }}
                className="absolute -top-2 -left-2 z-30 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-md transition-transform hover:scale-110"
                aria-label="Remove widget"
              >
                <MinusCircle size={16} />
              </button>
            )}
            <Widget size={w.size} type={w.type} />
          </div>
        ))}
      </div>

      {/* When in editing mode, show option to add Notes widget or reset */}
      {isEditing && (
        <div className="flex items-center justify-center gap-2 pt-1">
          {!activeWidgets.some((w) => w.type === "notes") && (
            <button
              onClick={() => addWidget({ id: "not", size: "medium", type: "notes" })}
              className="px-3 py-1 rounded-full text-[11px] font-medium text-gray-800 dark:text-white/90 bg-black/10 hover:bg-black/15 dark:bg-white/20 dark:hover:bg-white/30 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <PlusCircle size={13} />
              <span>Add Notes</span>
            </button>
          )}
          <button
            onClick={() => setActiveWidgets(DEFAULT_WIDGETS)}
            className="px-3 py-1 rounded-full text-[11px] font-medium text-gray-700 hover:text-black dark:text-white/70 dark:hover:text-white bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Big Sur Edit Widgets Pill Button */}
      <div className="flex justify-center pt-2 pb-6">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-1.5 rounded-full text-[12px] font-medium text-gray-800 dark:text-white/90 bg-black/10 hover:bg-black/15 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm transition-all focus:outline-none"
        >
          {isEditing ? t("Done") || "Done" : t("EditWidgets") || "Edit Widgets"}
        </button>
      </div>
    </div>
  );
};
