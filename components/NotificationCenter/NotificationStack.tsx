import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronDown } from "lucide-react";
import { Notification } from "../../store/notificationStore";

interface NotificationStackProps {
  grouped: Record<string, Notification[]>;
  clearAll: () => void;
  removeNotification: (id: string) => void;
  title: string;
}

export const NotificationStack: React.FC<NotificationStackProps> = ({
  grouped,
  clearAll,
  removeNotification,
  title,
}) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const hasNotes = Object.keys(grouped).length > 0;
  if (!hasNotes) return null;

  const toggleStack = (app: string) => {
    setExpanded((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  return (
    <div className="mb-4">
      {/* Big Sur Notification Section Header */}
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="text-[11px] font-semibold text-white/80 uppercase tracking-wider drop-shadow-xs">
          {title}
        </h3>
        <button
          onClick={clearAll}
          className="text-[11px] font-medium text-white/80 hover:text-white bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 shadow-xs"
        >
          <X size={10} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([app, notes]) => {
          const isExp = expanded.includes(app);
          const topNote = notes[0];
          const hasMultiple = notes.length > 1;

          return (
            <div key={app} className="space-y-1.5">
              {(isExp ? notes : [topNote]).map((note) => (
                <div
                  key={note.id}
                  className="group relative bg-white/80 dark:bg-[#2c2c2e]/85 backdrop-blur-2xl rounded-[16px] p-3 shadow-lg border border-white/40 dark:border-white/10 transition-all duration-150 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-[18px] h-[18px] rounded-[4px] relative overflow-hidden shrink-0 shadow-2xs">
                        {note.icon ? (
                          <Image src={note.icon} alt={app} fill className="object-cover" sizes="18px" />
                        ) : (
                          <div className="w-full h-full bg-[#007AFF] text-white flex items-center justify-center text-[10px] font-bold">
                            {app[0]}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {note.appName || app}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 font-normal">
                        {note.time}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 w-4 h-4 rounded-full bg-black/10 dark:bg-white/15 hover:bg-black/20 dark:hover:bg-white/30 text-gray-500 dark:text-gray-300 flex items-center justify-center transition-all ml-1"
                        aria-label="Dismiss notification"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-gray-900 dark:text-white leading-tight">
                      {note.title}
                    </h4>
                    <p className="text-[12px] text-gray-700 dark:text-gray-300 mt-0.5 leading-snug line-clamp-2">
                      {note.body}
                    </p>
                  </div>
                </div>
              ))}

              {/* Stack expansion toggle */}
              {hasMultiple && !isExp && (
                <button
                  onClick={() => toggleStack(app)}
                  className="w-full py-1 text-center text-[11px] font-medium text-white/70 hover:text-white flex items-center justify-center gap-1 transition-colors"
                >
                  <span>{notes.length - 1} more notifications</span>
                  <ChevronDown size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
