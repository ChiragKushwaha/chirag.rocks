/* eslint-disable @next/next/no-img-element */
import { useCallback } from 'react';
import useProcessesState from '../../../contexts/process';
import useDoubleClick from '../../../hooks/useDoubleClick';
import type { Process } from '../../../utils/process-directory';

const TaskbarEntry = (props: Process) => {
  const minimize = useProcessesState((state) => state.minimized);
  // const maximize = useProcessesState((state) => state.maximized);

  const minimizeFunction = useCallback(() => {
    minimize(props.pid);
  }, [props.pid, minimize]);

  // const maximizeFunction = useCallback(() => {
  //   maximize(props.pid);
  // }, [props.pid, maximize]);

  return (
    <ol>
      <button onClick={useDoubleClick(minimizeFunction)}>
        <figure>
          {props.icon && (
            <img draggable={false} src={props.icon} alt={props.title} />
          )}
          <figcaption>{props.title}</figcaption>
        </figure>
      </button>
    </ol>
  );
};

export default TaskbarEntry;
