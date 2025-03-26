import useProcessesState from '../../contexts/process';
import Window from '../system/window';

const ProcessLoader = () => {
  const processes = useProcessesState((state) => state.processes);
  return (
    <>
      {Object.entries(processes).map(([id, { Component, hasWindow }]) => {
        return hasWindow ? (
          <Window key={id}>
            <Component />
          </Window>
        ) : (
          <Component key={id} />
        );
      })}
    </>
  );
};

export default ProcessLoader;
