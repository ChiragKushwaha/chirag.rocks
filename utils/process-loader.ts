import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Processes } from '../types/process-directory';
import processDirectory from './process-directory';

interface ProcessState {
  processes: Processes;
}

const useProcessesState = create<ProcessState>()(
  devtools(
    persist(
      (set) => ({
        processes: processDirectory
      }),
      { name: 'processes' }
    )
  )
);

export default useProcessesState;
