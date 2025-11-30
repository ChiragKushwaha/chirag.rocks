import { create } from "zustand";
import { Process, WindowSize } from "../types/process";
import { ReactNode } from "react";

interface ProcessState {
  processes: Process[];
  activePid: number | null;
  nextPid: number;
  maxZIndex: number;

  launchProcess: (
    id: string,
    title: string,
    icon: string,
    component: ReactNode,
    initDimension?: WindowSize
  ) => void;
  closeProcess: (pid: number) => void;
  focusProcess: (pid: number) => void;
  minimizeProcess: (pid: number) => void;
  maximizeProcess: (pid: number) => void;
  resizeProcess: (
    pid: number,
    width: number,
    height: number,
    x: number,
    y: number
  ) => void; // New Action
  updateWindowPosition: (pid: number, x: number, y: number) => void;
  snapWindow: (pid: number, type: "left" | "right" | "reset") => void; // New Action for Split Screen
}

export const useProcessStore = create<ProcessState>((set, get) => ({
  processes: [],
  activePid: null,
  nextPid: 1000,
  maxZIndex: 100,

  launchProcess: (id, title, icon, component, initDimension) => {
    const { processes, nextPid, maxZIndex } = get();

    // Single Instance Check
    const existing = processes.find((p) => p.id === id);
    if (existing) {
      get().focusProcess(existing.pid);
      if (existing.isMinimized) {
        set((state) => ({
          processes: state.processes.map((p) =>
            p.pid === existing.pid ? { ...p, isMinimized: false } : p
          ),
        }));
      }
      return;
    }

    const newProcess: Process = {
      pid: nextPid,
      id,
      title,
      icon,
      component,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      zIndex: maxZIndex + 1,
      // Use provided dimension or default waterfall position
      dimension: initDimension || {
        width: 700,
        height: 500,
        x: 100 + processes.length * 30,
        y: 60 + processes.length * 30,
      },
      memoryUsage: Math.floor(Math.random() * 200) + 50,
    };

    set({
      processes: [...processes, newProcess],
      activePid: nextPid,
      nextPid: nextPid + 1,
      maxZIndex: maxZIndex + 1,
    });
  },

  closeProcess: (pid) =>
    set((state) => ({
      processes: state.processes.filter((p) => p.pid !== pid),
      activePid: state.activePid === pid ? null : state.activePid,
    })),

  focusProcess: (pid) =>
    set((state) => {
      const newMaxZ = state.maxZIndex + 1;
      return {
        activePid: pid,
        maxZIndex: newMaxZ,
        processes: state.processes.map((p) =>
          p.pid === pid
            ? { ...p, isFocused: true, zIndex: newMaxZ }
            : { ...p, isFocused: false }
        ),
      };
    }),

  minimizeProcess: (pid) =>
    set((state) => ({
      activePid: null,
      processes: state.processes.map((p) =>
        p.pid === pid ? { ...p, isMinimized: true, isFocused: false } : p
      ),
    })),

  maximizeProcess: (pid) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.pid === pid ? { ...p, isMaximized: !p.isMaximized } : p
      ),
    })),

  resizeProcess: (pid, width, height, x, y) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.pid === pid ? { ...p, dimension: { width, height, x, y } } : p
      ),
    })),

  updateWindowPosition: (pid, x, y) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.pid === pid ? { ...p, dimension: { ...p.dimension, x, y } } : p
      ),
    })),

  // Split Screen / Snapping Logic
  snapWindow: (pid, type) =>
    set((state) => {
      if (type === "reset") return state; // Handle in component usually, or reset to default logic here

      const width = window.innerWidth / 2;
      const height = window.innerHeight - 32; // Minus menubar
      const y = 32;
      const x = type === "left" ? 0 : width;

      return {
        processes: state.processes.map((p) =>
          p.pid === pid
            ? {
                ...p,
                isMaximized: false, // Ensure we aren't in fullscreen mode
                dimension: { width, height, x, y },
              }
            : p
        ),
      };
    }),
}));
