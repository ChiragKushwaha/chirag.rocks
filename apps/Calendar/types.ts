export type ViewMode = "day" | "week" | "month" | "year";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendarId: string; // 'home', 'work', etc.
  location?: string;
}

export interface CalendarCategory {
  id: string;
  name: string;
  color: string;
}
