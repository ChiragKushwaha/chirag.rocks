import { create } from "zustand";

export interface Notification {
  id: string;
  app: string;
  title: string;
  body: string;
  time: string;
  icon?: string;
  appName?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: "1",
      app: "Mail",
      title: "Mail",
      body: "New sign-in detected on your account.",
      time: "2m ago",
      appName: "Mail",
    },
    {
      id: "2",
      app: "Messages",
      title: "Messages",
      body: "Mom: Don't forget dinner tonight!",
      time: "1h ago",
      appName: "Messages",
    },
    {
      id: "3",
      app: "Messages",
      title: "Messages",
      body: "Dad: Where are you?",
      time: "1h ago",
      appName: "Messages",
    },
    {
      id: "4",
      app: "Messages",
      title: "Messages",
      body: "Sis: Can I borrow your charger?",
      time: "2h ago",
      appName: "Messages",
    },
  ],
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAll: () => set({ notifications: [] }),
}));
