import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ProcessState } from '../types/context/process';
import { initialProcessContextState } from '../utils/inital-context-states';

const useProcessesState = create<ProcessState>()(
  devtools(persist(() => initialProcessContextState, { name: 'processes' }))
);

export default useProcessesState;
