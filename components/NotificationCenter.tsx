import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSystemStore } from "../store/systemStore";
import { Widget } from "./widgets/Widget";
import { X, MinusCircle } from "lucide-react";
import { useNotificationStore, Notification } from "../store/notificationStore";

export const NotificationCenter: React.FC = () => {
  const { isNotificationCenterOpen, toggleNotificationCenter } =
    useSystemStore();
  const { notifications, removeNotification, clearAll } =
    useNotificationStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isNotificationCenterOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        // Don't close if clicking the menu bar clock (handled there)
        !(event.target as Element).closest("#menu-bar-clock")
      ) {
        toggleNotificationCenter();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationCenterOpen, toggleNotificationCenter]);

  // Group notifications
  const groupedNotifications = notifications.reduce((acc, note) => {
    if (!acc[note.app]) acc[note.app] = [];
    acc[note.app].push(note);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <div
      ref={panelRef}
      className={`
        fixed top-[30px] right-2 bottom-2 w-80
        bg-[rgba(245,245,245,0.6)] dark:bg-[rgba(30,30,30,0.6)]
        backdrop-blur-[50px] saturate-150
        border border-white/20 dark:border-white/10
        rounded-2xl shadow-2xl
        z-[9999]
        transition-transform duration-300 ease-out
        flex flex-col overflow-hidden
        ${isNotificationCenterOpen ? "translate-x-0" : "translate-x-[110%]"}
      `}
    >
      {/* Header / Notifications Section */}
      <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Notifications
              </h3>
              <button
                onClick={clearAll}
                className="text-xs text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 px-2 py-0.5 rounded-full transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(groupedNotifications).map(([app, notes]) => (
                <div
                  key={app}
                  className="relative group/stack"
                  onMouseEnter={() =>
                    setExpandedGroups((prev) => [...prev, app])
                  }
                  onMouseLeave={() =>
                    setExpandedGroups((prev) => prev.filter((g) => g !== app))
                  }
                >
                  {notes.map((note, index) => (
                    <div
                      key={note.id}
                      className={`
                                        bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-sm border border-white/10
                                        transition-all duration-300 ease-out
                                        ${
                                          index > 0 &&
                                          !expandedGroups.includes(app)
                                            ? "absolute top-0 left-0 w-full h-full scale-[0.95] -translate-y-2 z-0 opacity-80"
                                            : "relative z-10 mb-2"
                                        }
                                        ${
                                          index > 1 &&
                                          !expandedGroups.includes(app)
                                            ? "scale-[0.9] -translate-y-4 opacity-60"
                                            : ""
                                        }
                                    `}
                      style={{
                        zIndex: expandedGroups.includes(app) ? 10 : 10 - index,
                        transformOrigin: "top center",
                      }}
                    >
                      <div className="flex items-start gap-3 relative group/note">
                        {/* Icon */}
                        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                          {note.icon ? (
                            <Image
                              src={note.icon}
                              alt={app}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          ) : (
                            app[0]
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-sm truncate">
                              {note.title}
                            </span>
                            <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                              {note.time}
                            </span>
                          </div>
                          <p className="text-xs text-gray-800 dark:text-gray-200 mt-0.5 line-clamp-2">
                            {note.body}
                          </p>
                        </div>

                        {/* Close Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(note.id);
                          }}
                          className="absolute -top-4 -left-4 opacity-0 group-hover/note:opacity-100 bg-gray-200 dark:bg-gray-600 rounded-full p-1 hover:bg-red-500 hover:text-white transition-all shadow-sm z-20"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Widgets Grid */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Widgets
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
                isEditing
                  ? "bg-blue-500 text-white"
                  : "text-blue-500 hover:bg-blue-500/10"
              }`}
            >
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Wrap widgets to handle edit mode (shake effect) */}
            {[
              { size: "small", type: "calendar", title: "Calendar" },
              { size: "small", type: "weather", title: "Weather" },
              { size: "medium", type: "reminders", title: "Reminders" },
              { size: "medium", type: "stocks", title: "Stocks" },
              { size: "small", type: "notes", title: "Notes" },
            ].map((w, i) => (
              <div
                key={i}
                className={`relative ${
                  w.size === "medium" ? "col-span-2" : "col-span-1"
                } ${isEditing ? "animate-wiggle" : ""}`}
              >
                {isEditing && (
                  <button className="absolute -top-2 -left-2 z-20 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 rounded-full p-1 hover:bg-red-500 hover:text-white shadow-md">
                    <MinusCircle size={14} />
                  </button>
                )}
                <Widget
                  size={w.size as any}
                  type={w.type as any}
                  title={w.title}
                />
              </div>
            ))}

            <div className="col-span-1 h-36 rounded-2xl bg-white/20 dark:bg-white/5 flex items-center justify-center text-xs text-gray-400 border-2 border-dashed border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              Add Widget
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
