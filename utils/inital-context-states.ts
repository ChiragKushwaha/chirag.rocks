import type { ProcessState } from '../types/context/process';
import type { SessionState } from '../types/context/session';
import { getStartupProcesses } from './process-directory';

export const initialProcessContextState: ProcessState = {
  processes: getStartupProcesses()
};

export const initialSessionContextState: SessionState = {
  theme: ''
};
