/* eslint-disable @next/next/no-img-element */
import useProcessesState from '../../../contexts/process';
import useWindowActions from '../../../hooks/useWindowActions';

const Titlebar = ({ pid }: { pid: string }) => {
  const processess = useProcessesState((state) => state.processes);
  const { title, icon } = processess[pid];

  const { onMinimize, onMaximize, onClose } = useWindowActions(pid);

  return (
    <header className="flex items-center justify-between p-4 handle bg-amber-700">
      <h1 onClick={onMaximize} className="">
        <figure className="w-8">
          {icon && <img draggable={false} src={icon} alt={title} />}
          <figcaption>{title}</figcaption>
        </figure>
      </h1>
      <nav className="cancel">
        <button onClick={onMinimize} className="bg-red-500">
          min
        </button>
        <button onClick={onMaximize} className="bg-green-500">
          max
        </button>
        <button onClick={onClose} className="bg-blue-500">
          close
        </button>
      </nav>
    </header>
  );
};

export default Titlebar;
