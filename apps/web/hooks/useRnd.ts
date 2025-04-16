import { useCallback } from 'react';
import type { Props, RndDragCallback, RndResizeCallback } from 'react-rnd';
import useDraggable from './useDraggable';
import useResizable from './useResizable';
import rndDefaults from '../utils/rndDefaults';

const useRnd = (maximized: boolean = false): Props => {
  const [size, setSize] = useResizable(maximized);
  const [position, setPosition] = useDraggable(maximized);

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
