import React from "react";
import { CALENDARS } from "../constants";
import { CalendarEvent } from "../types";

interface SearchResultsProps {
  events: CalendarEvent[];
  searchQuery: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  events,
  searchQuery,
}) => {
  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-2">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">
        Search Results
      </h2>
      {filteredEvents.length === 0 ? (
        <div className="text-gray-500 text-center mt-10">No events found</div>
      ) : (
        filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/10 flex items-center gap-3"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                CALENDARS.find((c) => c.id === event.calendarId)?.color
              }`}
            />
            <div>
              <div className="font-medium dark:text-white">{event.title}</div>
              <div className="text-xs text-gray-500">
                {event.start.toLocaleDateString()} •{" "}
                {event.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
