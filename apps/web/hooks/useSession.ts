import { useState } from 'react';
import { Position } from './useDraggable';
import { Size } from './useResizable';

export type SessionContextState = {
  windowStates: WindowStates;
  setWindowStates: React.Dispatch<React.SetStateAction<WindowStates>>;
};

export type WindowState = {
  position?: Position;
  size?: Size;
};

export type WindowStates = {
  [pid: string]: WindowState;
};
const useSession = (): SessionContextState => {
  const [windowStates, setWindowStates] = useState<WindowStates>({});

  return { windowStates, setWindowStates };
};

export default useSession;
