import type { JSX } from 'react';
import { create } from 'zustand';
import {
  getStartupProcesses,
  processDirectory
} from '../utils/process-directory';
import type { Process, Processes } from '../utils/process-directory';

export type ProcessesMap = (
  callback: ([id, process]: [string, Process]) => JSX.Element
) => JSX.Element[];

export type ProcessState = {
  processes: Processes;
  close: (pid: string) => void;
  open: (pid: string) => void;
  toggleSetting: (pid: string, setting: 'minimized' | 'maximized') => void;
  minimized: (pid: string) => void;
  maximized: (pid: string) => void;
};

const useProcessesState = create<ProcessState>((set, get) => ({
  processes: getStartupProcesses(),
  close: (pid) => {
    set((state) => {
      const { [pid]: _closedProcess, ...remainingProcess } = state.processes;
      return { ...state, processes: remainingProcess };
    });
  },
  open: (pid) => {
    set((state) => {
      if (state.processes[pid] || !processDirectory[pid]) {
        return state;
      } else {
        return {
          ...state,
          processes: {
            ...state.processes,
            [pid]: processDirectory[pid]
          }
        };
      }
    });
  },
  toggleSetting: (pid, setting) => {
    set((state) => {
      const { [pid]: process } = state.processes;

      if (!process) {
        return state;
      } else {
        const newProcess = {
          ...process,
          [setting]: !process[setting]
        };
        console.log(newProcess);
        return {
          ...state,
          processes: {
            ...state.processes,
            [pid]: newProcess
          }
        };
      }
    });
  },
  maximized: (pid) => {
    get().toggleSetting(pid, 'maximized');
  },
  minimized: (pid) => {
    get().toggleSetting(pid, 'minimized');
  }
}));

export default useProcessesState;
