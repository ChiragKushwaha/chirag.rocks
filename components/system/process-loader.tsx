import useProcessesState from '../../contexts/process';
import useFileSystem from '../../hooks/useFileSystem';
import RenderProcess from './render-process';

const ProcessLoader = () => {
  const processes = useProcessesState((state) => state.processes);
  const {} = useFileSystem();
  return Object.entries(processes).map(([id, process]) => {
    return <RenderProcess key={id} {...process} />;
  });
};

export default ProcessLoader;
