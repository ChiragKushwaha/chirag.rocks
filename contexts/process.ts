import { create } from 'zustand';
import type { ProcessState } from '../types/context/process';
import {
  getStartupProcesses,
  processDirectory
} from '../utils/process-directory';

const useProcessesState = create<ProcessState>((set) => ({
  processes: getStartupProcesses(),
  close: (processId) => {
    set((state) => {
      const { [processId]: _closedProcess, ...remainingProcess } =
        state.processes;
      return { ...state, processes: remainingProcess };
    });
  },
  open: (processId) => {
    set((state) => {
      if (state.processes[processId] || !processDirectory[processId]) {
        return state;
      } else {
        return {
          ...state,
          processes: {
            ...state.processes,
            [processId]: processDirectory[processId]
          }
        };
      }
    });
  }
}));

export default useProcessesState;
