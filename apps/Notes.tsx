import React, { useState, useEffect } from "react";
import { Search, Trash2, Folder, Plus, Edit3, MonitorUp } from "lucide-react";
import { fs } from "../lib/FileSystem";
import { useSystemStore } from "../store/systemStore";
import { useStickyNoteStore } from "../store/stickyNoteStore";
import { useTranslations } from "next-intl";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  timestamp: number; // For sorting
  folder: string;
  deleted?: boolean;
}

interface NotesProps {
  initialPath?: string;
  initialFilename?: string;
  initialNoteId?: string;
}

export const Notes: React.FC<NotesProps> = ({
  initialPath,
  initialFilename,
  initialNoteId,
}) => {
  const t = useTranslations("Notes");
  const { user } = useSystemStore();
  const { addNote } = useStickyNoteStore();
  const [activeFolder, setActiveFolder] = useState<"Notes" | "Trash">("Notes");

  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mac-notes-app");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse notes", e);
        }
      }
    }
    return [
      {
        id: "1",
        title: "Project Ideas",
        content:
          "1. macOS Clone in React\n2. AI Coding Assistant\n3. Personal Portfolio",
        date: "Today at 10:42 AM",
        timestamp: 1701310000000,
        folder: "Notes",
      },
      {
        id: "2",
        title: "Grocery List",
        content: "- Milk\n- Eggs\n- Bread\n- Coffee",
        date: "Yesterday",
        timestamp: 1701223600000,
        folder: "Notes",
      },
    ];
  });

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    if (initialNoteId) return initialNoteId;
    if (notes.length > 0) return notes[0].id;
    return null;
  });

  // Effect to handle initialNoteId changes if the app is already open
  useEffect(() => {
    if (initialNoteId && selectedNoteId !== initialNoteId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedNoteId(initialNoteId);
      setActiveFolder("Notes");
    }
  }, [initialNoteId, selectedNoteId]);

  const [searchQuery, setSearchQuery] = useState("");

  // Load note from file if opened via Desktop
  useEffect(() => {
    const loadFile = async () => {
      if (initialPath && initialFilename && initialFilename.endsWith(".note")) {
        try {
          const content = await fs.readFile(initialPath, initialFilename);
          const title = initialFilename.replace(".note", "");

          setNotes((prevNotes) => {
            const existing = prevNotes.find((n) => n.title === title);
            if (existing) {
              // If it was deleted, restore it
              if (existing.deleted) {
                existing.deleted = false;
              }
              setSelectedNoteId(existing.id);
              setActiveFolder("Notes"); // Switch to notes view
              return [...prevNotes];
            }

            const newNote: Note = {
              id: Date.now().toString(),
              title,
              content,
              date: t("Editor.Date", {
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }),
              timestamp: Date.now(),
              folder: "Notes",
            };
            setSelectedNoteId(newNote.id);
            setActiveFolder("Notes");
            return [newNote, ...prevNotes];
          });
        } catch (e) {
          console.error("Failed to load note file", e);
        }
      }
    };
    loadFile();
  }, [initialPath, initialFilename, t]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("mac-notes-app", JSON.stringify(notes));
  }, [notes]);

  const formatDate = () => {
    const now = new Date();
    return t("Editor.Date", {
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: t("NewNote"),
      content: "",
      date: formatDate(),
      timestamp: Date.now(),
      folder: "Notes",
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setActiveFolder("Notes");
  };

  const deleteNote = async (id: string) => {
    const noteToDelete = notes.find((n) => n.id === id);

    // If already in trash, permanently delete
    if (activeFolder === "Trash") {
      const newNotes = notes.filter((n) => n.id !== id);
      setNotes(newNotes);
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
      return;
    }

    // Soft delete (move to trash)
    const newNotes = notes.map((n) =>
      n.id === id ? { ...n, deleted: true } : n
    );
    setNotes(newNotes);

    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }

    // Delete from Desktop if exists
    if (noteToDelete) {
      const userName = user?.name || "Guest";
      const desktopPath = `/Users/${userName}/Desktop`;
      const fileName = `${noteToDelete.title || "Untitled Note"}.note`;

      try {
        if (await fs.exists(`${desktopPath}/${fileName}`)) {
          await fs.delete(desktopPath, fileName);
          window.dispatchEvent(new Event("file-system-change"));
        }
      } catch (e) {
        console.error("Failed to delete desktop note", e);
      }
    }
  };

  const restoreNote = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, deleted: false } : n)));
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

  const updateNote = (
    id: string,
    field: "title" | "content",
    value: string
  ) => {
    setNotes(
      notes.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            [field]: value,
            date: formatDate(),
            timestamp: Date.now(),
          };
        }
        return n;
      })
    );
  };

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const addToDesktop = React.useCallback(() => {
    if (!selectedNote) return;

    addNote({
      id: Date.now().toString(),
      text: selectedNote.content || selectedNote.title,
      color: "yellow",
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      rotation: Math.random() * 4 - 2,
      width: 220,
      height: 220,
      zIndex: 10,
      originNoteId: selectedNote.id, // Link back to this note
      title: selectedNote.title,
    });

    alert("Sticky note added to desktop!");
  }, [selectedNote, addNote]);

  const filteredNotes = notes
    .filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFolder = activeFolder === "Trash" ? n.deleted : !n.deleted;

      return matchesSearch && matchesFolder;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif] text-[13px] select-none">
      {/* Folders Sidebar */}
      <div className="w-[180px] bg-[#f5f5f7] dark:bg-[#272727] border-r border-gray-200/70 dark:border-black/25 flex flex-col pt-4 px-2 shrink-0">
        <div className="px-2 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {t("Sidebar.iCloud")}
        </div>
        <div
          onClick={() => setActiveFolder("Notes")}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-[5px] mb-0.5 cursor-default transition-colors ${
            activeFolder === "Notes"
              ? "bg-[#007AFF]/10 dark:bg-[#007AFF]/15"
              : "hover:bg-black/5 dark:hover:bg-white/5"
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setActiveFolder("Notes");
            }
          }}
          aria-label={t("Sidebar.Notes")}
        >
          <Folder size={16} className="text-[#facc15] fill-[#facc15]" />
          <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200">{t("Sidebar.Notes")}</span>
        </div>
        <div
          onClick={() => setActiveFolder("Trash")}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-[5px] cursor-default text-gray-600 dark:text-gray-400 transition-colors ${
            activeFolder === "Trash"
              ? "bg-[#007AFF]/10 dark:bg-[#007AFF]/15"
              : "hover:bg-black/5 dark:hover:bg-white/5"
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setActiveFolder("Trash");
            }
          }}
          aria-label={t("Sidebar.RecentlyDeleted")}
        >
          <Trash2 size={16} />
          <span className="text-[13px]">{t("Sidebar.RecentlyDeleted")}</span>
        </div>
      </div>

      {/* Notes List Sidebar */}
      <div className="w-[240px] bg-white dark:bg-[#1e1e1e] border-r border-gray-200/70 dark:border-black/20 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-[17px]">
              {activeFolder === "Trash"
                ? t("Sidebar.RecentlyDeleted")
                : t("Sidebar.Notes")}
            </h2>
            {activeFolder === "Notes" && (
              <button
                onClick={createNote}
                className="hover:bg-gray-100 dark:hover:bg-white/10 p-1 rounded"
                aria-label={t("NewNote")}
              >
                <Plus size={20} className="text-[#facc15]" />
              </button>
            )}
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-2 text-gray-400"
            />
            <input
              type="text"
              placeholder={t("Search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#dcdce0] dark:bg-[#3a3a3a] border-none rounded-[6px] pl-7 pr-3 py-1 text-[12px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#facc15]/60 transition-all"
              aria-label="Search notes"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`px-4 py-3 border-b border-gray-100 dark:border-white/5 cursor-default transition-colors ${
                selectedNoteId === note.id
                  ? "bg-[#facc15]/15 dark:bg-[#facc15]/10"
                  : "hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedNoteId(note.id);
                }
              }}
              aria-label={`Note: ${note.title}`}
            >
              <h4
                className={`text-[13px] font-bold mb-0.5 truncate text-gray-900 dark:text-white`}
              >
                {note.title || t("NewNote")}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                <span className="shrink-0">{note.date.split(" at")[0]}</span>
                <span className="truncate">
                  {note.content.substring(0, 30) || t("NoAdditionalText")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-[#fefef5] dark:bg-[#1e1e1e]">
        {selectedNote ? (
          <>
            <div className="h-14 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400">{selectedNote.date}</span>
              <div className="flex gap-2">
                {activeFolder === "Notes" && (
                  <button
                    onClick={addToDesktop}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500 hover:text-[#facc15] transition-colors"
                    title={t("Editor.AddToDesktop")}
                    aria-label={t("Editor.AddToDesktop")}
                  >
                    <MonitorUp size={18} />
                  </button>
                )}

                {activeFolder === "Trash" ? (
                  <button
                    onClick={() => restoreNote(selectedNote.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500 hover:text-green-500 transition-colors"
                    title={t("Editor.Restore")}
                  >
                    <span className="text-xs font-bold">
                      {t("Editor.Restore")}
                    </span>
                  </button>
                ) : null}

                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500 hover:text-red-500 transition-colors"
                  title={
                    activeFolder === "Trash"
                      ? t("Editor.DeletePermanently")
                      : t("Editor.Delete")
                  }
                  aria-label={
                    activeFolder === "Trash"
                      ? t("Editor.DeletePermanently")
                      : t("Editor.Delete")
                  }
                >
                  <Trash2 size={18} />
                </button>

                {activeFolder === "Notes" && (
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-[#facc15]"
                    aria-label="Edit note"
                  >
                    <Edit3 size={18} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) =>
                  updateNote(selectedNote.id, "title", e.target.value)
                }
                disabled={activeFolder === "Trash"}
                className="w-full text-3xl font-bold mb-4 bg-transparent border-none focus:outline-none placeholder-gray-400 text-gray-900 dark:text-white disabled:opacity-50"
                placeholder={t("Editor.TitlePlaceholder")}
                aria-label="Note title"
              />
              <textarea
                value={selectedNote.content}
                onChange={(e) =>
                  updateNote(selectedNote.id, "content", e.target.value)
                }
                disabled={activeFolder === "Trash"}
                className="w-full h-[calc(100%-4rem)] text-lg leading-relaxed text-gray-800 dark:text-gray-300 bg-transparent border-none focus:outline-none resize-none placeholder-gray-400 disabled:opacity-50"
                placeholder={t("Editor.ContentPlaceholder")}
                aria-label="Note content"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Folder size={64} className="mb-4 opacity-20" />
            <p className="text-lg">{t("Editor.EmptyState")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
