import { Rnd } from 'react-rnd';
import useProcessesState from '../../../contexts/process';
import useResizable from '../../../hooks/useResizable';
import type { ProcessComponentProps } from '../processes/render-process';
import Titlebar from './titlebar';
import rndDefaults from '../../../utils/rndDefaults';
import useDraggable from '../../../hooks/useDraggable';

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
  const { position, updatePosition } = useDraggable(maximized);

  return (
    <Rnd
      disableDragging={maximized}
      enableResizing={!maximized}
      size={size}
      position={position}
      onDragStop={updatePosition}
      onResize={updateSize}
      {...rndDefaults}
    >
      <div
        className={`bg-amber-200 w-full h-full ${minimized ? 'hidden' : 'block'}`}
      >
        <Titlebar pid={pid} />
        {children}
      </div>
    </Rnd>
  );
};

export default Window;
