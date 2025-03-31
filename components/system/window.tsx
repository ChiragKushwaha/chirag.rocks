import useProcessesState from '../../contexts/process';
import { ProcessComponentProps } from './processes/render-process';

const Window = ({
  children,
  pid
}: Readonly<
  {
    children: React.ReactNode;
  } & ProcessComponentProps
>) => {
  const { [pid]: process } = useProcessesState((state) => state.processes);
  const minimized = process.minimized;
  return (
    <div className={`bg-amber-200 absolute ${minimized ? 'hidden' : 'block'}`}>
      {children}
    </div>
  );
};

export default Window;
