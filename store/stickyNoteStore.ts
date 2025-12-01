import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StickyNote {
  id: string;
  text: string;
  color: "yellow" | "pink" | "blue" | "green" | "gray";
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  zIndex: number;
}

interface StickyNoteState {
  notes: StickyNote[];
  addNote: (note: StickyNote) => void;
  updateNote: (id: string, updates: Partial<StickyNote>) => void;
  removeNote: (id: string) => void;
  bringToFront: (id: string) => void;
}

export const useStickyNoteStore = create<StickyNoteState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        })),
      removeNote: (id) =>
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
      bringToFront: (id) =>
        set((state) => {
          const maxZ = Math.max(...state.notes.map((n) => n.zIndex), 0);
          return {
            notes: state.notes.map((n) =>
              n.id === id ? { ...n, zIndex: maxZ + 1 } : n
            ),
          };
        }),
    }),
    { name: "mac-sticky-notes" }
  )
);
