import { Rnd } from 'react-rnd';
import useProcessesState from '../../../contexts/process';
import useRnd from '../../../hooks/useRnd';
import useSessionContext, {
  WindowState,
  WindowStates
} from '../../../hooks/useSession';
import { useEffect, useRef } from 'react';
import useSession from '../../../hooks/useSession';

type RndWindowProps = {
  pid: string;
  children: React.ReactNode;
};
const RndWindow = ({ children, pid }: RndWindowProps) => {
  console.log(pid);
  const processes = useProcessesState((state) => state.processes);
  const { maximized } = processes[pid] || {};
  const props = useRnd(pid, maximized);

  const rndRef = useRef<Rnd | null>(null);

  const { setWindowStates } = useSession();

  useEffect(() => {
    const { current } = rndRef || {};
    return () =>
      setWindowStates((currentWindowStates) => ({
        ...currentWindowStates,
        [pid]: {
          position: current?.props?.position,
          size: current?.props?.size
        } as WindowState
      }));
  }, [pid, setWindowStates]);

  return (
    <Rnd ref={rndRef} style={{ zIndex: 1 }} {...props}>
      {children}
    </Rnd>
  );
};

export default RndWindow;
