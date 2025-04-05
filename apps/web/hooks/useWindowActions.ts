import { useCallback } from 'react';
import useProcessesState from '../contexts/process';

const useWindowActions = (pid: string) => {
  const minimized = useProcessesState((state) => state.minimized);
  const maximized = useProcessesState((state) => state.maximized);
  const close = useProcessesState((state) => state.close);

  const onMinimize = useCallback(() => minimized(pid), [minimized, pid]);
  const onMaximize = useCallback(() => maximized(pid), [maximized, pid]);
  const onClose = useCallback(() => close(pid), [close, pid]);

  return { onMinimize, onMaximize, onClose };
};

export default useWindowActions;
