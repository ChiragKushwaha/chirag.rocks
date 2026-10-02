import React, { useMemo } from "react";
import Image from "next/image";
import { useProcessStore } from "../store/processStore";
import { Process } from "../types/process";
import { CalendarIcon } from "./icons/CalendarIcon";

interface DockMinimizedItemProps {
  process: Process;
}

/**
 * Resolves the genuine macOS Big Sur icon URL for any application.
 * All icons exist in public/icons/*.webp.
 */
export function getAppIconUrl(process: { id: string; icon?: any; title?: string }): string {
  if (
    typeof process.icon === "string" &&
    (process.icon.startsWith("/") ||
      process.icon.startsWith("http") ||
      process.icon.startsWith("data:"))
  ) {
    return process.icon;
  }

  const id = (process.id || "").toLowerCase().trim();
  const title = (process.title || "").toLowerCase().trim();
  const icon =
    typeof process.icon === "string" ? process.icon.toLowerCase().trim() : "";

  // Direct ID / Title / Icon mappings to public/icons/*.webp
  if (id === "finder" || title === "finder" || icon === "finder")
    return "/icons/finder.webp";
  if (id === "safari" || title === "safari" || icon === "safari")
    return "/icons/safari.webp";
  if (id === "terminal" || title === "terminal" || icon === "terminal")
    return "/icons/terminal.webp";
  if (id === "calculator" || title === "calculator" || icon === "calculator")
    return "/icons/calculator.webp";
  if (id === "notes" || title === "notes" || icon === "notes")
    return "/icons/notes.webp";
  if (
    id.includes("setting") ||
    title.includes("setting") ||
    icon.includes("setting")
  )
    return "/icons/settings.webp";
  if (id === "messages" || title === "messages" || icon === "messages")
    return "/icons/messages.webp";
  if (id === "mail" || title === "mail" || icon === "mail")
    return "/icons/mail.webp";
  if (id === "maps" || title === "maps" || icon === "maps")
    return "/icons/maps.webp";
  if (id === "photos" || title === "photos" || icon === "photos")
    return "/icons/photos.webp";
  if (
    id === "preview" ||
    title.endsWith(".pdf") ||
    title.toLowerCase().includes("resume") ||
    icon === "preview"
  )
    return "/icons/preview.webp";
  if (id === "trash" || title === "trash" || icon === "trash")
    return "/icons/trash.webp";
  if (id === "facetime" || title === "facetime" || icon === "facetime")
    return "/icons/facetime.webp";
  if (id === "music" || title === "music" || icon === "music")
    return "/icons/music.webp";
  if (id === "tv" || title === "tv" || icon === "tv") return "/icons/tv.webp";
  if (id === "news" || title === "news" || icon === "news")
    return "/icons/news.webp";
  if (
    id.includes("store") ||
    title.includes("store") ||
    icon.includes("store")
  )
    return "/icons/app_store.webp";
  if (id === "freeform" || title === "freeform" || icon === "freeform")
    return "/icons/freeform.webp";
  if (id === "reminders" || title === "reminders" || icon === "reminders")
    return "/icons/reminders.webp";
  if (id === "contacts" || title === "contacts" || icon === "contacts")
    return "/icons/contacts.webp";
  if (id === "stocks" || title === "stocks" || icon === "stocks")
    return "/icons/stocks.webp";
  if (id === "weather" || title === "weather" || icon === "weather")
    return "/icons/weather.webp";
  if (id === "launchpad" || title === "launchpad" || icon === "launchpad")
    return "/icons/mission_control.webp";

  if (icon && !icon.includes(" ")) {
    return `/icons/${icon.replace(/\.(webp|png)$/, "")}.webp`;
  }

  return "/icons/finder.webp";
}

export const DockMinimizedItem: React.FC<DockMinimizedItemProps> = ({
  process,
}) => {
  const { focusProcess } = useProcessStore();
  const iconUrl = useMemo(() => getAppIconUrl(process), [process]);

  // Compute proportional preview width and height based on the window's actual dimensions
  const { previewWidth, previewHeight } = useMemo(() => {
    const winWidth = process.dimension?.width || 800;
    const winHeight = process.dimension?.height || 500;
    const aspect = Math.max(0.4, Math.min(2.5, winWidth / winHeight));

    // macOS Big Sur dock preview constraints: max height ~46px, max width ~56px
    let width: number;
    let height: number;

    if (aspect >= 1) {
      width = Math.min(56, Math.max(38, Math.round(40 * aspect)));
      height = Math.round(width / aspect);
      if (height > 46) {
        height = 46;
        width = Math.round(height * aspect);
      }
    } else {
      height = 46;
      width = Math.min(46, Math.max(28, Math.round(height * aspect)));
    }

    return { previewWidth: width, previewHeight: height };
  }, [process.dimension?.width, process.dimension?.height]);

  const isCalendar =
    process.id.toLowerCase() === "calendar" ||
    process.title.toLowerCase() === "calendar";

  return (
    <button
      id={`dock-minimized-${process.pid}`}
      onClick={() => focusProcess(process.pid)}
      className="group relative flex items-center justify-center transition-transform duration-200 ease-out hover:scale-105 active:scale-95 shrink-0"
      style={{ width: 54, height: 54 }}
      aria-label={`Restore ${process.title}`}
    >
      {/* macOS Big Sur Tooltip */}
      <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-gray-900 dark:text-gray-100 shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-50 border border-black/10 dark:border-white/15">
        {process.title}
      </div>

      {/* Wrapper matching preview dimensions so badge positions relative to preview corner */}
      <div
        className="relative"
        style={{ width: previewWidth, height: previewHeight }}
      >
        {/* Miniature Minimized Window Preview Frame */}
        <div className="w-full h-full rounded-[6px] overflow-hidden border border-black/20 dark:border-white/20 bg-white/40 dark:bg-[#1e1e1e]/60 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.35)] ring-1 ring-black/10 dark:ring-black/40 flex items-center justify-center transition-transform duration-150 group-hover:brightness-105">
          {process.thumbnail ? (
            /* Captured Window Content Thumbnail */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={process.thumbnail}
              alt={process.title}
              className="w-full h-full object-cover object-top select-none pointer-events-none"
            />
          ) : (
            /* Realistic Mini macOS Window Mockup */
            <div className="w-full h-full flex flex-col bg-white/90 dark:bg-[#252528]/95 select-none">
              {/* Mini Window Titlebar */}
              <div className="h-2.5 bg-black/5 dark:bg-white/10 flex items-center px-1 gap-0.5 border-b border-black/10 dark:border-white/10 shrink-0">
                <div className="w-1 h-1 rounded-full bg-[#FF5F56]" />
                <div className="w-1 h-1 rounded-full bg-[#FFBD2E]" />
                <div className="w-1 h-1 rounded-full bg-[#27C93F]" />
                <span className="text-[6px] text-gray-500 dark:text-gray-400 font-medium truncate ml-0.5 max-w-[30px]">
                  {process.title}
                </span>
              </div>
              {/* Mini Window Content Area */}
              <div className="flex-1 flex flex-col items-center justify-center p-1 bg-[#f5f5f7] dark:bg-[#1a1a1c] overflow-hidden">
                <div className="w-full flex items-center gap-1 opacity-25 dark:opacity-40">
                  <div className="w-1/3 h-1 bg-current rounded-full" />
                  <div className="w-2/3 h-1 bg-current rounded-full" />
                </div>
                <div className="w-full flex items-center gap-1 opacity-15 dark:opacity-25 mt-1">
                  <div className="w-1/2 h-0.5 bg-current rounded-full" />
                  <div className="w-1/4 h-0.5 bg-current rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* App Icon Badge (Overlaid at bottom-right corner of the window preview) */}
        <div className="absolute -bottom-1 -right-1 w-[20px] h-[20px] rounded-full bg-white dark:bg-[#252528] p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.5)] ring-1 ring-black/15 dark:ring-white/25 z-20 flex items-center justify-center overflow-hidden">
          {isCalendar ? (
            <CalendarIcon size={16} />
          ) : (
            <Image
              src={iconUrl}
              alt="App Badge"
              width={18}
              height={18}
              className="w-full h-full object-contain"
              unoptimized
            />
          )}
        </div>
      </div>
    </button>
  );
};
