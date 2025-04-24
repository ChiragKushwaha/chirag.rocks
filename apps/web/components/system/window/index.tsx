import { WindowDrillInNavigation } from '../../../../../packages/ui';
import useProcessesState from '../../../contexts/process';
import type { ProcessComponentProps } from '../processes/render-process';
import RndWindow from './rnd-window';
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
  const { minimized } = processes[pid] || {};

  return (
    <RndWindow pid={pid}>
      <div className={`w-full h-full ${minimized ? 'hidden' : 'block'}`}>
        <Titlebar pid={pid} />
        <WindowDrillInNavigation />
        {children}
      </div>
    </RndWindow>
  );
};

export default Window;
