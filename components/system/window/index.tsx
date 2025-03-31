import { Rnd } from 'react-rnd';
import useProcessesState from '../../../contexts/process';
import useResizable from '../../../hooks/useResizable';
import type { ProcessComponentProps } from '../processes/render-process';
import Titlebar from './titlebar';
import rndDefaults from '../../../utils/rndDefaults';

const Window = ({
  children,
  pid
}: Readonly<
  {
    children: React.ReactNode;
  } & ProcessComponentProps
>) => {
  const processes = useProcessesState((state) => state.processes);
  const { minimized, maximized } = processes[pid];
  const { size, updateSize } = useResizable(maximized);

  return (
    <Rnd
      enableResizing={!maximized}
      size={size}
      onResizeStop={updateSize}
      {...rndDefaults}
    >
      <div
        className={`bg-amber-200 w-full h-full absolute ${minimized ? 'hidden' : 'block'}`}
      >
        <Titlebar pid={pid} />
        {children}
      </div>
    </Rnd>
  );
};

export default Window;
