import { useCallback } from 'react';
import type { Props, RndDragCallback, RndResizeCallback } from 'react-rnd';
import useDraggable from './useDraggable';
import useResizable from './useResizable';
import rndDefaults from '../utils/rndDefaults';
import { pid } from 'process';
import useSession from './useSession';

const useRnd = (pid: string, maximized: boolean = false): Props => {
  const { windowStates } = useSession();
  console.log(windowStates);
  const { size: previousSize, position: previousPosition } =
    windowStates[pid] || {};
  const [size, setSize] = useResizable(maximized, previousSize);
  const [position, setPosition] = useDraggable(maximized, previousPosition);

  const onDragStop = useCallback<RndDragCallback>(
    (_event, data) => {
      setPosition({ x: data.x, y: data.y });
    },
    [setPosition]
  );

  const onResize = useCallback<RndResizeCallback>(
    (_event, _direction, ref, _delta, position) => {
      setSize({ width: ref.style.width, height: ref.style.height });
      setPosition({ x: position.x, y: position.y });
    },
    [setPosition, setSize]
  );

  return {
    disableDragging: maximized,
    enableResizing: !maximized,
    size,
    position,
    onDragStop,
    onResize,
    ...rndDefaults
  };
};

export default useRnd;
