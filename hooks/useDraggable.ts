import { useCallback, useState } from 'react';

import type { RndDragCallback } from 'react-rnd';
type Position = {
  x: number;
  y: number;
};
const defaultWindowPosition: Position = { x: 0, y: 0 };

const useDraggable = (maximized?: boolean) => {
  const [position, setPosition] = useState<Position>(defaultWindowPosition);

  const updatePosition = useCallback<RndDragCallback>((_event, data) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

  return {
    position: {
      x: maximized ? 0 : position.x,
      y: maximized ? 0 : position.y
    },
    updatePosition
  };
};

export default useDraggable;
