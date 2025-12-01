import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Reminder {
  id: string;
  text: string;
  completed: boolean;
  list: string;
  date?: string;
  dueTime?: number; // Timestamp
  notified?: boolean;
  flagged?: boolean;
}

interface ReminderState {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  toggleReminder: (id: string) => void;
  toggleFlag: (id: string) => void;
  deleteReminder: (id: string) => void;
  markNotified: (id: string) => void;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set) => ({
      reminders: [
        { id: "1", text: "Buy groceries", completed: false, list: "Reminders" },
        {
          id: "2",
          text: "Call Mom",
          completed: false,
          list: "Reminders",
          date: "Today",
        },
      ],
      addReminder: (reminder) =>
        set((state) => ({ reminders: [...state.reminders, reminder] })),
      toggleReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, completed: !r.completed } : r
          ),
        })),
      toggleFlag: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, flagged: !r.flagged } : r
          ),
        })),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),
      markNotified: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, notified: true } : r
          ),
        })),
    }),
    {
      name: "macOS-reminders",
    }
  )
);
