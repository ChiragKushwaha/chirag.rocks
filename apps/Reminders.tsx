import React, { useState } from "react";
import { Search, Plus, Calendar, Flag, List } from "lucide-react";

interface Reminder {
  id: string;
  text: string;
  completed: boolean;
  list: string;
  date?: string;
}

export const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", text: "Buy groceries", completed: false, list: "Reminders" },
    {
      id: "2",
      text: "Call Mom",
      completed: false,
      list: "Reminders",
      date: "Today",
    },
    { id: "3", text: "Finish project", completed: true, list: "Work" },
    {
      id: "4",
      text: "Pay bills",
      completed: false,
      list: "Reminders",
      date: "Tomorrow",
    },
  ]);

  const [activeList, setActiveList] = useState("Reminders");

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const filteredReminders = reminders.filter(
    (r) => r.list === activeList || activeList === "All"
  );

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
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
            placeholder="Search"
            className="w-full bg-gray-200 dark:bg-black/20 border-none rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Smart Lists Grid */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="bg-white dark:bg-[#3a3a3a] p-2 rounded-lg shadow-sm flex flex-col justify-between h-20 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#444]">
            <div className="flex justify-between items-start">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Calendar size={16} />
              </div>
              <span className="text-xl font-bold">
                {reminders.filter((r) => r.date === "Today").length}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Today
            </span>
          </div>
          <div className="bg-white dark:bg-[#3a3a3a] p-2 rounded-lg shadow-sm flex flex-col justify-between h-20 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#444]">
            <div className="flex justify-between items-start">
              <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white">
                <Calendar size={16} />
              </div>
              <span className="text-xl font-bold">
                {reminders.filter((r) => r.date).length}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Scheduled
            </span>
          </div>
          <div className="bg-white dark:bg-[#3a3a3a] p-2 rounded-lg shadow-sm flex flex-col justify-between h-20 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#444]">
            <div className="flex justify-between items-start">
              <div className="w-7 h-7 rounded-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center text-white">
                <List size={16} />
              </div>
              <span className="text-xl font-bold">{reminders.length}</span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              All
            </span>
          </div>
          <div className="bg-white dark:bg-[#3a3a3a] p-2 rounded-lg shadow-sm flex flex-col justify-between h-20 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#444]">
            <div className="flex justify-between items-start">
              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <Flag size={16} />
              </div>
              <span className="text-xl font-bold">0</span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Flagged
            </span>
          </div>
        </div>

        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
          MY LISTS
        </h3>
        <div className="space-y-1">
          <div
            onClick={() => setActiveList("Reminders")}
            className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer ${
              activeList === "Reminders"
                ? "bg-gray-200 dark:bg-white/10"
                : "hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <List size={12} />
              </div>
              <span className="text-sm">Reminders</span>
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
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white">
                <List size={12} />
              </div>
              <span className="text-sm">Work</span>
            </div>
            <span className="text-xs text-gray-500">
              {reminders.filter((r) => r.list === "Work").length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e]">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">
            {activeList}
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
                        reminder.date === "Today"
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {reminder.date}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3 py-2 text-gray-400 cursor-text">
              <Plus size={20} />
              <span>New Reminder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
