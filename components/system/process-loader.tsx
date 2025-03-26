import dynamic from 'next/dynamic';
import type { FC } from 'react';
import useProcessesState from '../../contexts/process';
import type { Process, Processes } from '../../types/context/process';

const Window = dynamic(() => import('../system/window'));

const RenderProcess: FC<Process> = ({ Component, hasWindow }) => {
  return hasWindow ? (
    <Window>
      <Component />
    </Window>
  ) : (
    <Component />
  );
};

const RenderProcesses: FC<{ processes: Processes }> = ({ processes }) => {
  return (
    <>
      {Object.entries(processes).map(([id, process]) => {
        return <RenderProcess key={id} {...process} />;
      })}
    </>
  );
};

const ProcessLoader = () => {
  const processes = useProcessesState((state) => state.processes);
  return <RenderProcesses processes={processes} />;
};

export default ProcessLoader;
