import React, { useState } from "react";
import { Search, Edit, Trash2, Folder } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  folder: string;
}

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Project Ideas",
      content:
        "1. macOS Clone in React\n2. AI Coding Assistant\n3. Personal Portfolio",
      date: "10:42 AM",
      folder: "Notes",
    },
    {
      id: "2",
      title: "Grocery List",
      content: "- Milk\n- Eggs\n- Bread\n- Coffee",
      date: "Yesterday",
      folder: "Notes",
    },
    {
      id: "3",
      title: "Meeting Notes",
      content: "Discuss Q4 roadmap and marketing strategy.",
      date: "Monday",
      folder: "Work",
    },
  ]);

  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Folders Sidebar */}
      <div className="w-48 bg-[#f5f5f7] dark:bg-[#2b2b2b] border-r border-gray-200 dark:border-black/20 flex flex-col pt-10 px-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/5 dark:bg-white/10 mb-1">
          <Folder size={16} className="text-yellow-500" />
          <span className="text-sm font-medium">All iCloud</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
          <Folder size={16} className="text-yellow-500" />
          <span className="text-sm">Notes</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
          <Folder size={16} className="text-yellow-500" />
          <span className="text-sm">Recently Deleted</span>
        </div>
      </div>

      {/* Notes List Sidebar */}
      <div className="w-64 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-black/20 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer ${
                selectedNoteId === note.id
                  ? "bg-yellow-500/10 dark:bg-yellow-500/20"
                  : "hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <h4
                className={`text-sm font-bold mb-1 ${
                  selectedNoteId === note.id
                    ? "text-yellow-600 dark:text-yellow-500"
                    : ""
                }`}
              >
                {note.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{note.date}</span>
                <span className="truncate">
                  {note.content.substring(0, 20)}...
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e]">
        {selectedNote ? (
          <>
            <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400">
                Last edited today at {selectedNote.date}
              </span>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500">
                  <Trash2 size={18} />
                </button>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-yellow-500">
                  <Edit size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              <h1
                className="text-3xl font-bold mb-4 outline-none"
                contentEditable
                suppressContentEditableWarning
              >
                {selectedNote.title}
              </h1>
              <div
                className="text-lg leading-relaxed text-gray-800 dark:text-gray-300 outline-none min-h-[500px]"
                contentEditable
                suppressContentEditableWarning
              >
                {selectedNote.content}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a note to view
          </div>
        )}
      </div>
    </div>
  );
};
