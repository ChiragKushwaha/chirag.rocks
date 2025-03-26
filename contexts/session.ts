import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { SessionState } from '../types/context/session';
import { initialSessionContextState } from '../utils/inital-context-states';

const useSessionState = create<SessionState>()(
  devtools(persist(() => initialSessionContextState, { name: 'sessions' }))
);

export default useSessionState;
