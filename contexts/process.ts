import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ProcessState } from '../types/context/process';
import processDirectory from '../utils/process-directory';

const useProcessesState = create<ProcessState>()(
  devtools(
    persist(
      () => ({
        processes: processDirectory
      }),
      { name: 'processes' }
    )
  )
);

export default useProcessesState;
