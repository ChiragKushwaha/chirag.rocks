import React from "react";
import { useCalendar } from "./Calendar/hooks/useCalendar";
import { Sidebar } from "./Calendar/components/Sidebar";
import { Toolbar } from "./Calendar/components/Toolbar";
import { MonthView } from "./Calendar/components/MonthView";
import { WeekView } from "./Calendar/components/WeekView";
import { DayView } from "./Calendar/components/DayView";
import { YearView } from "./Calendar/components/YearView";
import { SearchResults } from "./Calendar/components/SearchResults";
import { EventModal } from "./Calendar/components/EventModal";

export const Calendar: React.FC = () => {
  const {
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    searchQuery,
    setSearchQuery,
    isSearching,
    setIsSearching,
    selectedCalendar,
    setSelectedCalendar,
    events,
    showEventModal,
    setShowEventModal,
    newEventTitle,
    setNewEventTitle,
    navigate,
    isSameDay,
    getEventsForDay,
    handleCreateEvent,
    daysInMonth,
    startDayOfMonth,
  } = useCalendar();

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar */}
      <Sidebar currentDate={currentDate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <Toolbar
          currentDate={currentDate}
          navigate={navigate}
          setCurrentDate={setCurrentDate}
          view={view}
          setView={setView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          setShowEventModal={setShowEventModal}
        />

        {/* View Content */}
        <div className="flex-1 overflow-hidden relative">
          {isSearching ? (
            <SearchResults events={events} searchQuery={searchQuery} />
          ) : (
            <>
              {view === "month" && (
                <MonthView
                  currentDate={currentDate}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  setShowEventModal={setShowEventModal}
                  daysInMonth={daysInMonth}
                  startDayOfMonth={startDayOfMonth}
                  isSameDay={isSameDay}
                  getEventsForDay={getEventsForDay}
                />
              )}

              {view === "week" && (
                <WeekView
                  currentDate={currentDate}
                  isSameDay={isSameDay}
                  getEventsForDay={getEventsForDay}
                />
              )}

              {view === "day" && (
                <DayView
                  currentDate={currentDate}
                  getEventsForDay={getEventsForDay}
                />
              )}

              {view === "year" && (
                <YearView
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  setView={setView}
                  daysInMonth={daysInMonth}
                  startDayOfMonth={startDayOfMonth}
                  isSameDay={isSameDay}
                  getEventsForDay={getEventsForDay}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          newEventTitle={newEventTitle}
          setNewEventTitle={setNewEventTitle}
          handleCreateEvent={handleCreateEvent}
          setShowEventModal={setShowEventModal}
          selectedCalendar={selectedCalendar}
          setSelectedCalendar={setSelectedCalendar}
        />
      )}
    </div>
  );
};
