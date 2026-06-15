import React, { useState } from "react";
import {
  Search, Plus, Calendar, Flag, List, Clock, X, CheckCircle2,
} from "lucide-react";
import { useReminderStore } from "../store/reminderStore";
import { useTranslations } from "next-intl";

export const Reminders: React.FC = () => {
  const t = useTranslations("Reminders");
  const { reminders, addReminder, toggleReminder, deleteReminder, toggleFlag } =
    useReminderStore();
  const [activeList, setActiveList] = useState("Reminders");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleAddReminder = () => {
    if (!newText.trim()) { setIsAdding(false); return; }

    let dueTime: number | undefined;
    let dateDisplay: string | undefined;
    if (newDate) {
      const dateObj = new Date(`${newDate}T${newTime || "00:00"}`);
      if (!isNaN(dateObj.getTime())) {
        dueTime = dateObj.getTime();
        const today = new Date();
        const isToday = dateObj.toDateString() === today.toDateString();
        const isTomorrow =
          new Date(today.setDate(today.getDate() + 1)).toDateString() ===
          dateObj.toDateString();
        if (isToday) dateDisplay = "Today";
        else if (isTomorrow) dateDisplay = "Tomorrow";
        else dateDisplay = dateObj.toLocaleDateString();
        if (newTime) {
          dateDisplay += ` at ${dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        }
      }
    }

    addReminder({
      id: Date.now().toString(),
      text: newText,
      completed: false,
      list: ["All", "Scheduled", "Flagged"].includes(activeList) ? "Reminders" : activeList,
      date: dateDisplay,
      dueTime,
      notified: false,
    });
    setNewText(""); setNewDate(""); setNewTime(""); setIsAdding(false);
  };

  const filteredReminders = reminders.filter((r) => {
    let matchesList = false;
    if (activeList === "All") matchesList = true;
    else if (activeList === "Scheduled") matchesList = !!(r.date || r.dueTime);
    else if (activeList === "Flagged") matchesList = !!r.flagged;
    else matchesList = r.list === activeList;
    return matchesList && (!searchQuery || r.text.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const smartLists = [
    { id: "Today", label: t("Sidebar.Today"), color: "#007AFF", icon: Calendar, count: reminders.filter((r) => r.date?.includes("Today")).length },
    { id: "Scheduled", label: t("Sidebar.Scheduled"), color: "#FF3B30", icon: Calendar, count: reminders.filter((r) => r.dueTime || r.date).length },
    { id: "All", label: t("Sidebar.All"), color: "#8E8E93", icon: List, count: reminders.length },
    { id: "Flagged", label: t("Sidebar.Flagged"), color: "#FF9500", icon: Flag, count: reminders.filter((r) => r.flagged).length },
  ];

  const myLists = [
    { id: "Reminders", label: t("Sidebar.Reminders"), color: "#007AFF" },
    { id: "Work", label: t("Sidebar.Work"), color: "#AF52DE" },
  ];

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif] text-[13px] relative select-none">
      {/* ── SIDEBAR ── */}
      <div className="w-[240px] bg-[#f5f5f7] dark:bg-[#272727] border-r border-gray-200/70 dark:border-black/25 flex flex-col shrink-0">
        {/* Search */}
        <div className="px-3 pt-4 pb-3">
          <div className="relative">
            <Search size={12} className="absolute left-2 top-[7px] text-gray-400" />
            <input
              type="text"
              placeholder={t("Search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#dcdce0] dark:bg-[#3a3a3a] border-none rounded-[6px] pl-7 pr-3 py-1 text-[12px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              aria-label={t("Search")}
            />
          </div>
        </div>

        {/* Smart Lists Grid */}
        <div className="grid grid-cols-2 gap-2 px-3 mb-4">
          {smartLists.map((sl) => {
            const Icon = sl.icon;
            const isActive = activeList === sl.id;
            return (
              <button
                key={sl.id}
                onClick={() => setActiveList(sl.id)}
                className={`p-3 rounded-[10px] flex flex-col justify-between h-[72px] cursor-default transition-all text-left ${
                  isActive
                    ? "ring-2 ring-offset-1 ring-offset-[#f5f5f7] dark:ring-offset-[#272727]"
                    : ""
                } bg-white dark:bg-[#3a3a3a] shadow-sm`}
                style={{ ringColor: sl.color } as React.CSSProperties}
              >
                <div className="flex justify-between items-start">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: sl.color }}
                  >
                    <Icon size={12} />
                  </div>
                  <span className="text-[18px] font-bold text-gray-900 dark:text-white">{sl.count}</span>
                </div>
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">{sl.label}</span>
              </button>
            );
          })}
        </div>

        {/* My Lists */}
        <div className="px-3">
          <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 mb-1.5">
            {t("Sidebar.MyLists")}
          </h3>
          <div className="space-y-0.5">
            {myLists.map((list) => {
              const isActive = activeList === list.id;
              const count = reminders.filter((r) => r.list === list.id).length;
              return (
              <button
                key={list.id}
                onClick={() => setActiveList(list.id)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[6px] cursor-default transition-colors ${
                  isActive
                    ? "bg-[#007AFF]/10 dark:bg-[#007AFF]/15"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                } text-gray-700 dark:text-gray-200`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: list.color }}
                  >
                    <List size={10} className="text-white" />
                  </div>
                  <span className={`text-[13px] font-medium ${isActive ? "text-[#007AFF]" : ""}`}>{list.label}</span>
                </div>
                <span className={`text-[12px] ${isActive ? "text-[#007AFF]" : "text-gray-400"}`}>{count}</span>
              </button>
            );
            })}
          </div>
        </div>

        <div className="flex-1" />

        {/* Add List button */}
        <div className="px-3 py-3 border-t border-gray-200/60 dark:border-black/15">
          <button className="flex items-center gap-2 text-[#007AFF] text-[13px] font-medium hover:opacity-70 transition-opacity">
            <div className="w-5 h-5 rounded-full bg-[#007AFF] flex items-center justify-center">
              <Plus size={12} className="text-white" />
            </div>
            Add List
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e] overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-2">
          <h1 className="text-[28px] font-bold text-[#007AFF]">
            {activeList === "Reminders" ? t("Sidebar.Reminders") :
             activeList === "Work" ? t("Sidebar.Work") :
             activeList === "Scheduled" ? t("Sidebar.Scheduled") :
             activeList === "All" ? t("Sidebar.All") :
             activeList === "Flagged" ? t("Sidebar.Flagged") : activeList}
          </h1>
        </div>

        {/* Reminders list */}
        <div className="flex-1 overflow-y-auto px-8 pb-4">
          {filteredReminders.length === 0 && !isAdding && (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-600 gap-3">
              <CheckCircle2 size={48} strokeWidth={0.8} />
              <span className="text-[14px]">No reminders</span>
            </div>
          )}

          <div className="space-y-0">
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="group flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-white/5"
              >
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`mt-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    reminder.completed
                      ? "bg-[#007AFF] border-[#007AFF]"
                      : "border-gray-300 dark:border-gray-500 hover:border-[#007AFF]"
                  }`}
                  aria-label={reminder.completed ? t("Actions.MarkIncomplete") : t("Actions.MarkComplete")}
                >
                  {reminder.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] leading-snug ${reminder.completed ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-900 dark:text-gray-100"}`}>
                    {reminder.text}
                  </p>
                  {reminder.date && (
                    <p className={`text-[11px] mt-0.5 ${reminder.date.includes("Today") ? "text-[#007AFF]" : "text-gray-400"}`}>
                      {reminder.date}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => toggleFlag(reminder.id)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${reminder.flagged ? "opacity-100 text-orange-400" : "text-gray-300 hover:text-orange-400"}`}
                  aria-label={reminder.flagged ? t("Actions.Unflag") : t("Actions.Flag")}
                >
                  <Flag size={14} fill={reminder.flagged ? "currentColor" : "none"} />
                </button>

                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-opacity"
                  aria-label={t("Actions.Delete")}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Add Reminder Input */}
            {isAdding ? (
              <div className="mt-2 p-4 bg-gray-50 dark:bg-[#2c2c2e] rounded-[10px] border border-gray-200 dark:border-gray-700 shadow-sm">
                <input
                  type="text"
                  placeholder={t("Inputs.Title")}
                  autoFocus
                  className="w-full bg-transparent border-none text-[14px] focus:outline-none mb-3 text-gray-900 dark:text-white placeholder-gray-400"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddReminder();
                    if (e.key === "Escape") setIsAdding(false);
                  }}
                  aria-label={t("Inputs.Title")}
                />
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 bg-white dark:bg-black/20 px-2.5 py-1.5 rounded-[7px] border border-gray-200 dark:border-gray-600">
                    <Calendar size={12} className="text-gray-400" />
                    <input type="date" className="bg-transparent border-none text-[12px] focus:outline-none text-gray-700 dark:text-gray-300" value={newDate} onChange={(e) => setNewDate(e.target.value)} aria-label="Date" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-black/20 px-2.5 py-1.5 rounded-[7px] border border-gray-200 dark:border-gray-600">
                    <Clock size={12} className="text-gray-400" />
                    <input type="time" className="bg-transparent border-none text-[12px] focus:outline-none text-gray-700 dark:text-gray-300" value={newTime} onChange={(e) => setNewTime(e.target.value)} aria-label="Time" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsAdding(false)} className="px-3 py-1 text-[12px] text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 rounded-[6px] transition-colors">
                    {t("Actions.Cancel")}
                  </button>
                  <button onClick={handleAddReminder} className="px-3 py-1 text-[12px] bg-[#007AFF] text-white rounded-[6px] hover:bg-[#0063d1] transition-colors font-medium">
                    {t("Actions.Add")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 mt-3 text-[#007AFF] text-[13px] font-medium hover:opacity-70 transition-opacity"
                aria-label={t("AddReminder")}
              >
                <Plus size={16} />
                {t("AddReminder")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
