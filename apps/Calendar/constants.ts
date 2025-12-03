import { CalendarCategory } from "./types";

export const CALENDARS: CalendarCategory[] = [
  { id: "home", name: "Home", color: "bg-blue-500" },
  { id: "work", name: "Work", color: "bg-purple-500" },
  { id: "family", name: "Family", color: "bg-green-500" },
  { id: "birthdays", name: "Birthdays", color: "bg-orange-500" },
  { id: "holidays", name: "Holidays", color: "bg-red-500" },
];

export const RECURRING_EVENTS = [
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
