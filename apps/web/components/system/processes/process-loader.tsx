'use client';
import useProcessesState from '../../../contexts/process';
import RenderProcess from './render-process';

const ProcessLoader = () => {
  const processes = useProcessesState((state) => state.processes);
  // const {} = useFileSystem();
  return Object.entries(processes).map(([id, process]) => {
    return <RenderProcess key={id} {...process} />;
  });
};

export default ProcessLoader;
