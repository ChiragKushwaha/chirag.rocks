import { useState } from "react";
import { ViewMode, CalendarEvent } from "../types";
import { RECURRING_EVENTS } from "../constants";

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState("home");
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");

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

  return {
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
    setEvents,
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
  };
};
