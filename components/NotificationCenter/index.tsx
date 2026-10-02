import React, { useEffect, useRef } from "react";
import { useSystemStore } from "../../store/systemStore";
import { useNotificationStore, Notification } from "../../store/notificationStore";
import { useTranslations } from "next-intl";
import { NotificationStack } from "./NotificationStack";
import { WidgetGrid } from "./WidgetGrid";

export const NotificationCenter: React.FC = () => {
  const t = useTranslations("NotificationCenter");
  const { isNotificationCenterOpen, toggleNotificationCenter } = useSystemStore();
  const { notifications, removeNotification, clearAll } = useNotificationStore();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isNotificationCenterOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("#menu-bar-clock")
      ) {
        toggleNotificationCenter();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationCenterOpen, toggleNotificationCenter]);

  const grouped = notifications.reduce((acc, note) => {
    if (!acc[note.app]) acc[note.app] = [];
    acc[note.app].push(note);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <aside
      ref={panelRef}
      aria-label="Notification Center and Widgets"
      className={`
        fixed top-[30px] right-0 bottom-0 w-[360px]
        bg-white/20 dark:bg-[#161618]/60
        backdrop-blur-[60px] backdrop-saturate-200
        border-l border-white/30 dark:border-white/10
        shadow-[-12px_0_36px_rgba(0,0,0,0.25)] z-9999
        transition-transform duration-300 ease-out
        flex flex-col select-none overflow-hidden
        ${isNotificationCenterOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="p-3.5 flex-1 overflow-y-auto no-scrollbar space-y-4">
        <NotificationStack
          grouped={grouped}
          clearAll={clearAll}
          removeNotification={removeNotification}
          title={t("Title")}
        />
        <WidgetGrid />
      </div>
    </aside>
  );
};
