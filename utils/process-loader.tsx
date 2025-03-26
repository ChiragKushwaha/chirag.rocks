import processDirectory from './process-directory';

const ProcessLoader = () => {
  return (
    <>
      {Object.entries(processDirectory).map(([id, { Component }]) => {
        return <Component key={id} />;
      })}
    </>
  );
};

export default ProcessLoader;
