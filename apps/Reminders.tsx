import React, { useState } from "react";
import { Search, Plus, Calendar, Flag, List, Clock, X } from "lucide-react";
import { useReminderStore } from "../store/reminderStore";
import { useTranslations } from "next-intl";

export const Reminders: React.FC = () => {
  const t = useTranslations("Reminders");
  const { reminders, addReminder, toggleReminder, deleteReminder, toggleFlag } =
    useReminderStore();
  const [activeList, setActiveList] = useState("Reminders");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Reminder State
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleAddReminder = () => {
    if (!newText.trim()) {
      setIsAdding(false);
      return;
    }

    let dueTime: number | undefined = undefined;
    let dateDisplay: string | undefined = undefined;

    if (newDate) {
      const dateObj = new Date(`${newDate}T${newTime || "00:00"}`);
      if (!isNaN(dateObj.getTime())) {
        dueTime = dateObj.getTime();

        // Format for display
        const today = new Date();
        const isToday = dateObj.toDateString() === today.toDateString();
        const isTomorrow =
          new Date(today.setDate(today.getDate() + 1)).toDateString() ===
          dateObj.toDateString();

        if (isToday) dateDisplay = "Today";
        else if (isTomorrow) dateDisplay = "Tomorrow";
        else dateDisplay = dateObj.toLocaleDateString();

        if (newTime) {
          dateDisplay += ` at ${dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        }
      }
    }

    addReminder({
      id: Date.now().toString(),
      text: newText,
      completed: false,
      list:
        activeList === "All" ||
        activeList === "Scheduled" ||
        activeList === "Flagged"
          ? "Reminders"
          : activeList,
      date: dateDisplay,
      dueTime,
      notified: false,
    });

    setNewText("");
    setNewDate("");
    setNewTime("");
    setIsAdding(false);
  };

  const filteredReminders = reminders.filter((r) => {
    let matchesList = false;
    if (activeList === "All") matchesList = true;
    else if (activeList === "Scheduled") matchesList = !!(r.date || r.dueTime);
    else if (activeList === "Flagged") matchesList = !!r.flagged;
    else matchesList = r.list === activeList;

    if (searchQuery) {
      return (
        matchesList && r.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return matchesList;
  });

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans relative">
      {/* Sidebar */}
      <div className="w-64 bg-[#f5f5f7] dark:bg-[#2b2b2b] border-r border-gray-200 dark:border-black/20 flex flex-col p-4">
        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={14}
            className="absolute left-2.5 top-1.5 text-gray-400"
          />
          <input
            type="text"
            placeholder={t("Search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-200 dark:bg-black/20 border-none rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label={t("Search")}
          />
        </div>

        {/* Smart Lists Grid */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div
            className="bg-white dark:bg-[#3a3a3a] p-2 rounded-lg shadow-sm flex flex-col justify-between h-20 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#444]"
            role="button"
            tabIndex={0}
            aria-label={`Today's reminders: ${
              reminders.filter((r) => r.date?.includes("Today")).length
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Calendar size={16} />
              </div>
              <span className="text-xl font-bold">
                {reminders.filter((r) => r.date?.includes("Today")).length}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t("Sidebar.Today")}
            </span>
          </div>
          <div
            onClick={() => setActiveList("Scheduled")}
            className={`bg-white dark:bg-[#3a3a3a] p-2 rounded-lg shadow-sm flex flex-col justify-between h-20 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#444] ${
              activeList === "Scheduled" ? "ring-2 ring-gray-400" : ""
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveList("Scheduled");
              }
            }}
            aria-label={`Scheduled reminders: ${
              reminders.filter((r) => r.dueTime || r.date).length
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white">
                <Calendar size={16} />
              </div>
              <span className="text-xl font-bold">
                {reminders.filter((r) => r.dueTime || r.date).length}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t("Sidebar.Scheduled")}
            </span>
          </div>
          <div
            onClick={() => setActiveList("All")}
            className={`bg-white dark:bg-[#3a3a3a] p-2 rounded-lg shadow-sm flex flex-col justify-between h-20 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#444] ${
              activeList === "All" ? "ring-2 ring-gray-400" : ""
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveList("All");
              }
            }}
            aria-label={`All reminders: ${reminders.length}`}
          >
            <div className="flex justify-between items-start">
              <div className="w-7 h-7 rounded-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center text-white">
                <List size={16} />
              </div>
              <span className="text-xl font-bold">{reminders.length}</span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t("Sidebar.All")}
            </span>
          </div>
          <div
            onClick={() => setActiveList("Flagged")}
            className={`bg-white dark:bg-[#3a3a3a] p-2 rounded-lg shadow-sm flex flex-col justify-between h-20 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#444] ${
              activeList === "Flagged" ? "ring-2 ring-gray-400" : ""
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveList("Flagged");
              }
            }}
            aria-label={`Flagged reminders: ${
              reminders.filter((r) => r.flagged).length
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <Flag size={16} />
              </div>
              <span className="text-xl font-bold">
                {reminders.filter((r) => r.flagged).length}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t("Sidebar.Flagged")}
            </span>
          </div>
        </div>

        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
          {t("Sidebar.MyLists")}
        </h3>
        <div className="space-y-1">
          <div
            onClick={() => setActiveList("Reminders")}
            className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer ${
              activeList === "Reminders"
                ? "bg-gray-200 dark:bg-white/10"
                : "hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveList("Reminders");
              }
            }}
            aria-label={t("Sidebar.Reminders")}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <List size={12} />
              </div>
              <span className="text-sm">{t("Sidebar.Reminders")}</span>
            </div>
            <span className="text-xs text-gray-500">
              {reminders.filter((r) => r.list === "Reminders").length}
            </span>
          </div>
          <div
            onClick={() => setActiveList("Work")}
            className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer ${
              activeList === "Work"
                ? "bg-gray-200 dark:bg-white/10"
                : "hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveList("Work");
              }
            }}
            aria-label={t("Sidebar.Work")}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white">
                <List size={12} />
              </div>
              <span className="text-sm">{t("Sidebar.Work")}</span>
            </div>
            <span className="text-xs text-gray-500">
              {reminders.filter((r) => r.list === "Work").length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e]">
        <div className="p-8 flex-1 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">
            {activeList === "Reminders"
              ? t("Sidebar.Reminders")
              : activeList === "Work"
              ? t("Sidebar.Work")
              : activeList === "Scheduled"
              ? t("Sidebar.Scheduled")
              : activeList === "All"
              ? t("Sidebar.All")
              : activeList === "Flagged"
              ? t("Sidebar.Flagged")
              : activeList}
          </h1>

          <div className="space-y-1">
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="group flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-800"
              >
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    reminder.completed
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                  }`}
                  aria-label={
                    reminder.completed
                      ? t("Actions.MarkIncomplete")
                      : t("Actions.MarkComplete")
                  }
                >
                  {reminder.completed && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </button>
                <div className="flex-1">
                  <p
                    className={`text-base ${
                      reminder.completed ? "text-gray-400 line-through" : ""
                    }`}
                  >
                    {reminder.text}
                  </p>
                  {reminder.date && (
                    <p
                      className={`text-xs ${
                        reminder.date.includes("Today")
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {reminder.date}
                    </p>
                  )}
                </div>

                {/* Flag Button */}
                <button
                  onClick={() => toggleFlag(reminder.id)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                    reminder.flagged
                      ? "opacity-100 text-orange-500"
                      : "text-gray-300 hover:text-orange-500"
                  }`}
                  aria-label={
                    reminder.flagged ? t("Actions.Unflag") : t("Actions.Flag")
                  }
                >
                  <Flag
                    size={16}
                    fill={reminder.flagged ? "currentColor" : "none"}
                  />
                </button>

                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                  aria-label={t("Actions.Delete")}
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {/* Add Reminder Input */}
            {isAdding ? (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-[#2c2c2e] rounded-lg border border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder={t("Inputs.Title")}
                  autoFocus
                  className="w-full bg-transparent border-none text-base focus:outline-none mb-2"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddReminder();
                    if (e.key === "Escape") setIsAdding(false);
                  }}
                  aria-label={t("Inputs.Title")}
                />
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 bg-white dark:bg-black/20 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                    <Calendar size={14} className="text-gray-500" />
                    <input
                      type="date"
                      className="bg-transparent border-none text-xs focus:outline-none"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      aria-label="Reminder date"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-black/20 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                    <Clock size={14} className="text-gray-500" />
                    <input
                      type="time"
                      className="bg-transparent border-none text-xs focus:outline-none"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      aria-label="Reminder time"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 rounded"
                  >
                    {t("Actions.Cancel")}
                  </button>
                  <button
                    onClick={handleAddReminder}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {t("Actions.Add")}
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 mt-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsAdding(true);
                  }
                }}
                aria-label={t("AddReminder")}
              >
                <Plus size={20} />
                <span>{t("AddReminder")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
