import React from "react";
import { CALENDARS } from "../constants";
import { useTranslations } from "next-intl";

interface EventModalProps {
  newEventTitle: string;
  setNewEventTitle: (title: string) => void;
  handleCreateEvent: () => void;
  setShowEventModal: (show: boolean) => void;
  selectedCalendar: string;
  setSelectedCalendar: (id: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  newEventTitle,
  setNewEventTitle,
  handleCreateEvent,
  setShowEventModal,
  selectedCalendar,
  setSelectedCalendar,
}) => {
  const t = useTranslations("Calendar.EventModal");
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#2b2b2b] w-80 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 p-4 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="font-semibold mb-4 dark:text-white">{t("Title")}</h3>
        <input
          autoFocus
          type="text"
          placeholder={t("EventTitlePlaceholder")}
          className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-black/20 border-none outline-none mb-4 dark:text-white placeholder-gray-500"
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateEvent()}
          aria-label={t("EventTitlePlaceholder")}
        />

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t("CalendarLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            {CALENDARS.map((cal) => (
              <button
                key={cal.id}
                onClick={() => setSelectedCalendar(cal.id)}
                className={`px-2 py-1 rounded text-xs border ${
                  selectedCalendar === cal.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
                aria-label={`Select calendar: ${cal.name}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${cal.color} inline-block mr-1`}
                />
                {cal.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowEventModal(false)}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md"
          >
            {t("Cancel")}
          </button>
          <button
            onClick={handleCreateEvent}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm"
          >
            {t("AddEvent")}
          </button>
        </div>
      </div>
    </div>
  );
};
