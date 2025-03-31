import useProcessesState from '../../../contexts/process';
import { ProcessComponentProps } from '../processes/render-process';
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
  const { minimized } = processes[pid];
  console.log(minimized);
  return (
    <div className={`bg-amber-200 absolute ${minimized ? 'hidden' : 'block'}`}>
      <Titlebar pid={pid} />
      {children}
    </div>
  );
};

export default Window;
