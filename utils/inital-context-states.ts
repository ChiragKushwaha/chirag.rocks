import type { ProcessState } from '../types/context/process';
import type { SessionState } from '../types/context/session';
import processDirectory from './process-directory';

export const initialProcessContextState: ProcessState = {
  processes: processDirectory
};

export const initialSessionContextState: SessionState = {
  theme: ''
};
