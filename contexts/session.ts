import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ProcessState } from '../types/context/process';
import processDirectory from '../utils/process-directory';
import { SessionState } from '../types/context/session';

const useSessionState = create<SessionState>()(
  devtools(
    persist(
      () => ({
        theme: ''
      }),
      { name: 'sessions' }
    )
  )
);

export default useSessionState;
