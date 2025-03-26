import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { SessionState } from '../types/context/session';

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
