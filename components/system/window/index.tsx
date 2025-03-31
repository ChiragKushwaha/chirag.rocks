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
      className={`bg-amber-200 ${minimized ? 'hidden' : 'block'}`}
      disableDragging={maximized}
      enableResizing={!maximized}
      size={size}
      position={position}
      onDragStop={updatePosition}
      onResizeStop={updateSize}
      {...rndDefaults}
    >
      <Titlebar pid={pid} />
      {children}
    </Rnd>
  );
};

export default Window;
