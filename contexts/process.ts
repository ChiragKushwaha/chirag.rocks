import { create } from 'zustand';
import type { ProcessState } from '../types/context/process';
import {
  getStartupProcesses,
  processDirectory
} from '../utils/process-directory';

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
