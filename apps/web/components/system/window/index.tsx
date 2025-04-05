import { Rnd } from 'react-rnd';
import useProcessesState from '../../../contexts/process';
import useDraggableAndResizable from '../../../hooks/useDraggableAndResizable';
import rndDefaults from '../../../utils/rndDefaults';
import type { ProcessComponentProps } from '../processes/render-process';
import Titlebar from './titlebar';

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
  const { size, updateSize, position, updatePosition } =
    useDraggableAndResizable(maximized);

  return (
    <Rnd
      style={{ zIndex: 1 }}
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
