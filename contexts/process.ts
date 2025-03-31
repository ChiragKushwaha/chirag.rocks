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
};

const useProcessesState = create<ProcessState>((set) => ({
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
  }
}));

export default useProcessesState;
