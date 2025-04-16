import { Rnd } from 'react-rnd';
import { WindowDrillInNavigation } from '../../../../../packages/ui';
import useProcessesState from '../../../contexts/process';
import useRnd from '../../../hooks/useRnd';
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
  const { minimized, maximized } = processes[pid] || {};
  const props = useRnd(maximized);

  return (
    <Rnd style={{ zIndex: 1 }} {...props}>
      <div className={`w-full h-full ${minimized ? 'hidden' : 'block'}`}>
        <Titlebar pid={pid} />
        <WindowDrillInNavigation />
        {children}
      </div>
    </Rnd>
  );
};

export default Window;
