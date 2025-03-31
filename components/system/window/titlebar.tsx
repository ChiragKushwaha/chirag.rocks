/* eslint-disable @next/next/no-img-element */
import { useCallback } from 'react';
import useProcessesState from '../../../contexts/process';

const Titlebar = ({ pid }: { pid: string }) => {
  const processess = useProcessesState((state) => state.processes);
  const minimized = useProcessesState((state) => state.minimized);
  const maximized = useProcessesState((state) => state.maximized);
  const close = useProcessesState((state) => state.close);

  const { title, icon } = processess[pid];

  const onMinimize = useCallback(() => minimized(pid), [minimized, pid]);
  const onMaximize = useCallback(() => maximized(pid), [maximized, pid]);
  const onClose = useCallback(() => close(pid), [close, pid]);

  return (
    <header className="flex items-center justify-between p-2">
      <h1 onClick={onMinimize}>
        <figure className="w-8">
          {icon && <img src={icon} alt={title} />}
          <figcaption>{title}</figcaption>
        </figure>
      </h1>
      <nav>
        <button onClick={onMinimize} className="bg-red-500">
          min
        </button>
        <button onClick={onMaximize} className="bg-green-500">
          max
        </button>
        <button onClick={onClose} className="bg-blue-500">
          close
        </button>
      </nav>
    </header>
  );
};

export default Titlebar;
