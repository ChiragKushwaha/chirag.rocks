import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  MapPin,
  X,
} from "lucide-react";

type ViewMode = "day" | "week" | "month" | "year";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendarId: string; // 'home', 'work', etc.
  location?: string;
}

const CALENDARS = [
  { id: "home", name: "Home", color: "bg-blue-500" },
  { id: "work", name: "Work", color: "bg-purple-500" },
  { id: "family", name: "Family", color: "bg-green-500" },
  { id: "birthdays", name: "Birthdays", color: "bg-orange-500" },
  { id: "holidays", name: "Holidays", color: "bg-red-500" },
];

const RECURRING_EVENTS = [
  {
    id: "chirag-bday",
    title: "Chirag Kushwaha's Birthday",
    month: 2, // March
    day: 30,
    calendarId: "birthdays",
    location: "Home",
  },
  {
    id: "pratibha-bday",
    title: "Pratibha Kushwaha's Birthday",
    month: 5, // June
    day: 6,
    calendarId: "birthdays",
    location: "Home",
  },
  {
    id: "republic-day",
    title: "Republic Day",
    month: 0, // Jan
    day: 26,
    calendarId: "holidays",
  },
  {
    id: "independence-day",
    title: "Independence Day",
    month: 7, // Aug
    day: 15,
    calendarId: "holidays",
  },
  {
    id: "gandhi-jayanti",
    title: "Gandhi Jayanti",
    month: 9, // Oct
    day: 2,
    calendarId: "holidays",
  },
  {
    id: "christmas",
    title: "Christmas",
    month: 11, // Dec
    day: 25,
    calendarId: "holidays",
  },
];

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState("home");

  // Initialize with default events and holidays
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const currentYear = new Date().getFullYear();
    const defaults: CalendarEvent[] = [
      // Indian Holidays (Variable dates - kept for current year approx)
      {
        id: "diwali",
        title: "Diwali",
        start: new Date(currentYear, 9, 20), // Approx
        end: new Date(currentYear, 9, 20),
        calendarId: "holidays",
      },
      {
        id: "holi",
        title: "Holi",
        start: new Date(currentYear, 2, 14), // Approx
        end: new Date(currentYear, 2, 14),
        calendarId: "holidays",
      },
    ];
    return defaults;
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(
        currentDate.getMonth() + (direction === "next" ? 1 : -1)
      );
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (view === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (view === "year") {
      newDate.setFullYear(
        currentDate.getFullYear() + (direction === "next" ? 1 : -1)
      );
    }
    setCurrentDate(newDate);
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const getEventsForDay = (date: Date) => {
    const dayEvents = events.filter((e) => isSameDay(e.start, date));

    // Add recurring events
    const recurring = RECURRING_EVENTS.filter(
      (re) => re.month === date.getMonth() && re.day === date.getDate()
    ).map((re) => ({
      id: `${re.id}-${date.getFullYear()}`,
      title: re.title,
      start: new Date(date.getFullYear(), re.month, re.day),
      end: new Date(date.getFullYear(), re.month, re.day, 23, 59),
      calendarId: re.calendarId,
      location: re.location,
    }));

    return [...dayEvents, ...recurring];
  };

  const handleCreateEvent = () => {
    if (!newEventTitle.trim()) return;
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEventTitle,
      start: selectedDate,
      end: new Date(selectedDate.getTime() + 60 * 60 * 1000), // 1 hour default
      calendarId: selectedCalendar,
    };
    setEvents([...events, newEvent]);
    setNewEventTitle("");
    setShowEventModal(false);
  };

  // --- RENDERERS ---

  const renderMonthView = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = startDayOfMonth(currentDate);
    const days = [];

    // Empty cells
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="min-h-[100px] border-b border-r border-gray-200 dark:border-white/10 bg-gray-50/30 dark:bg-white/5"
        />
      );
    }

    // Days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const isToday = isSameDay(date, new Date());
      const isSelected = isSameDay(date, selectedDate);
      const dayEvents = getEventsForDay(date);

      days.push(
        <div
          key={i}
          onClick={() => setSelectedDate(date)}
          onDoubleClick={() => {
            setSelectedDate(date);
            setShowEventModal(true);
          }}
          className={`min-h-[100px] border-b border-r border-gray-200 dark:border-white/10 p-1 relative group transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
            isSelected ? "bg-blue-50/50 dark:bg-blue-500/10" : ""
          }`}
        >
          <div className="flex justify-center">
            <span
              className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${
                isToday
                  ? "bg-red-500 text-white"
                  : isSelected
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {i}
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                  CALENDARS.find((c) => c.id === event.calendarId)?.color
                } text-white opacity-90`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    return (
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="grid grid-cols-8 border-b border-gray-200 dark:border-white/10 sticky top-0 bg-white dark:bg-[#1e1e1e] z-10">
          <div className="w-12 border-r border-gray-200 dark:border-white/10"></div>
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={`py-2 text-center border-r border-gray-200 dark:border-white/10 ${
                isSameDay(day, new Date())
                  ? "text-red-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <div className="text-xs font-medium">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-xl font-light w-8 h-8 mx-auto flex items-center justify-center rounded-full ${
                  isSameDay(day, new Date()) ? "bg-red-500 text-white" : ""
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          <div
            className="grid grid-cols-8 relative"
            style={{ height: "1440px" }}
          >
            {" "}
            {/* 24h * 60px */}
            {/* Time Column */}
            <div className="border-r border-gray-200 dark:border-white/10 text-xs text-gray-400 text-right pr-2 pt-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-[60px] -mt-2.5">
                  {i === 0
                    ? ""
                    : `${i > 12 ? i - 12 : i} ${i >= 12 ? "PM" : "AM"}`}
                </div>
              ))}
            </div>
            {/* Days Columns */}
            {weekDays.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="border-r border-gray-200 dark:border-white/10 relative"
              >
                {/* Grid Lines */}
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[60px] border-b border-gray-100 dark:border-white/5 w-full absolute top-0"
                    style={{ top: `${i * 60}px` }}
                  />
                ))}

                {/* Events */}
                {getEventsForDay(day).map((event) => {
                  const startHour =
                    event.start.getHours() + event.start.getMinutes() / 60;
                  const duration =
                    (event.end.getTime() - event.start.getTime()) /
                    (1000 * 60 * 60);
                  return (
                    <div
                      key={event.id}
                      className={`absolute left-0.5 right-0.5 rounded px-2 py-1 text-xs text-white overflow-hidden ${
                        CALENDARS.find((c) => c.id === event.calendarId)?.color
                      }`}
                      style={{
                        top: `${startHour * 60}px`,
                        height: `${Math.max(20, duration * 60)}px`,
                      }}
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div>{event.location}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return (
      <div className="grid grid-cols-4 gap-4 p-4 overflow-y-auto h-full">
        {months.map((month) => {
          const date = new Date(currentDate.getFullYear(), month, 1);
          const days = daysInMonth(date);
          const start = startDayOfMonth(date);

          return (
            <div
              key={month}
              className="bg-gray-50 dark:bg-white/5 rounded-lg p-2 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => {
                setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
                setView("month");
              }}
            >
              <div className="text-red-500 font-semibold mb-2 text-sm">
                {date.toLocaleString("default", { month: "long" })}
              </div>
              <div className="grid grid-cols-7 text-[10px] gap-y-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-gray-400 text-center">
                    {d}
                  </div>
                ))}
                {Array.from({ length: start }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                  const dayDate = new Date(
                    currentDate.getFullYear(),
                    month,
                    i + 1
                  );
                  const isToday = isSameDay(dayDate, new Date());
                  const hasEvents = getEventsForDay(dayDate).length > 0;
                  return (
                    <div
                      key={i}
                      className={`text-center relative ${
                        isToday
                          ? "text-red-500 font-bold"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {i + 1}
                      {hasEvents && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-gray-400 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSearchResults = () => {
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

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-60 bg-gray-50/90 dark:bg-[#2b2b2b]/90 backdrop-blur-xl border-r border-gray-200 dark:border-black/20 flex flex-col p-4 pt-8">
        <div className="mb-6">
          <div className="w-full aspect-square bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center mb-4">
            <div className="text-red-500 font-bold text-xl">
              {currentDate
                .toLocaleString("default", { month: "short" })
                .toUpperCase()}
            </div>
            <div className="text-5xl font-light text-gray-800 dark:text-gray-100">
              {currentDate.getDate()}
            </div>
            <div className="text-gray-500 dark:text-gray-400 font-medium">
              {currentDate.toLocaleString("default", { weekday: "long" })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
              ICLOUD
            </h3>
            <div className="space-y-1">
              {CALENDARS.slice(0, 3).map((cal) => (
                <div
                  key={cal.id}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${cal.color} shadow-sm`}
                  />
                  <span className="text-sm">{cal.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
              OTHER
            </h3>
            <div className="space-y-1">
              {CALENDARS.slice(3).map((cal) => (
                <div
                  key={cal.id}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${cal.color} shadow-sm`}
                  />
                  <span className="text-sm">{cal.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="bg-gray-200 dark:bg-white/10 rounded-lg p-3 text-xs text-gray-500 dark:text-gray-400 text-center">
            No invitations
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 dark:border-black/20 flex items-center justify-between px-4 bg-white dark:bg-[#1e1e1e] shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold dark:text-white min-w-[160px]">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h1>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-0.5 shadow-inner">
              <button
                onClick={() => navigate("prev")}
                className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 text-sm font-medium hover:bg-white dark:hover:bg-gray-600 rounded mx-0.5 transition-all"
              >
                Today
              </button>
              <button
                onClick={() => navigate("next")}
                className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 text-xs font-medium shadow-inner">
              <button
                onClick={() => setView("day")}
                className={`px-3 py-1 rounded-md transition-all ${
                  view === "day"
                    ? "bg-white dark:bg-gray-600 shadow-sm"
                    : "hover:bg-white/50 dark:hover:bg-gray-600/50"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-3 py-1 rounded-md transition-all ${
                  view === "week"
                    ? "bg-white dark:bg-gray-600 shadow-sm"
                    : "hover:bg-white/50 dark:hover:bg-gray-600/50"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView("month")}
                className={`px-3 py-1 rounded-md transition-all ${
                  view === "month"
                    ? "bg-white dark:bg-gray-600 shadow-sm"
                    : "hover:bg-white/50 dark:hover:bg-gray-600/50"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView("year")}
                className={`px-3 py-1 rounded-md transition-all ${
                  view === "year"
                    ? "bg-white dark:bg-gray-600 shadow-sm"
                    : "hover:bg-white/50 dark:hover:bg-gray-600/50"
                }`}
              >
                Year
              </button>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1" />

            {isSearching ? (
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1">
                <Search size={14} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search events..."
                  className="bg-transparent border-none outline-none text-sm w-32 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => {
                    setIsSearching(false);
                    setSearchQuery("");
                  }}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearching(true)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Search size={18} />
              </button>
            )}

            <button
              onClick={() => setShowEventModal(true)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-hidden relative">
          {isSearching ? (
            renderSearchResults()
          ) : (
            <>
              {view === "month" && (
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1e1e1e]">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-white/10 last:border-r-0"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-7 auto-rows-fr flex-1 overflow-y-auto">
                    {renderMonthView()}
                  </div>
                </div>
              )}

              {view === "week" && renderWeekView()}

              {view === "day" && (
                <div className="flex flex-col h-full overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 dark:border-white/10 sticky top-0 bg-white dark:bg-[#1e1e1e] z-10">
                    <div className="text-red-500 font-medium text-sm">
                      {currentDate.toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </div>
                    <div className="text-3xl font-light">
                      {currentDate.getDate()}
                    </div>
                  </div>
                  {/* Reuse week view logic but for single day */}
                  <div className="flex-1 relative" style={{ height: "1440px" }}>
                    <div className="absolute left-0 w-16 border-r border-gray-200 dark:border-white/10 h-full bg-gray-50/50 dark:bg-white/5">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-[60px] border-b border-transparent text-xs text-gray-400 text-right pr-2 pt-2"
                        >
                          {i === 0
                            ? ""
                            : `${i > 12 ? i - 12 : i} ${i >= 12 ? "PM" : "AM"}`}
                        </div>
                      ))}
                    </div>
                    <div className="ml-16 relative h-full">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-[60px] border-b border-gray-100 dark:border-white/5 w-full absolute top-0"
                          style={{ top: `${i * 60}px` }}
                        />
                      ))}
                      {getEventsForDay(currentDate).map((event) => {
                        const startHour =
                          event.start.getHours() +
                          event.start.getMinutes() / 60;
                        const duration =
                          (event.end.getTime() - event.start.getTime()) /
                          (1000 * 60 * 60);
                        return (
                          <div
                            key={event.id}
                            className={`absolute left-2 right-2 rounded px-3 py-2 text-sm text-white overflow-hidden ${
                              CALENDARS.find((c) => c.id === event.calendarId)
                                ?.color
                            }`}
                            style={{
                              top: `${startHour * 60}px`,
                              height: `${Math.max(30, duration * 60)}px`,
                            }}
                          >
                            <div className="font-semibold">{event.title}</div>
                            <div className="opacity-90 text-xs flex items-center gap-1 mt-0.5">
                              <MapPin size={10} />{" "}
                              {event.location || "No location"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {view === "year" && renderYearView()}
            </>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#2b2b2b] w-80 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 p-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-semibold mb-4 dark:text-white">New Event</h3>
            <input
              autoFocus
              type="text"
              placeholder="Event Title"
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-black/20 border-none outline-none mb-4 dark:text-white placeholder-gray-500"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateEvent()}
            />

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Calendar
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
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
