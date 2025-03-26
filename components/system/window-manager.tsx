import useProcessesState from '../../utils/process-loader';

const WindowManager = () => {
  const processes = useProcessesState((state) => state.processes);
  return (
    <>
      {Object.entries(processes).map(([id, { Component }]) => {
        return <Component key={id} />;
      })}
    </>
  );
};

export default WindowManager;
