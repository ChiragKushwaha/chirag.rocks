import { useState } from 'react';
import { DEFAULT_WINDOW_POSITION } from '../utils/constants';

export type Position = {
  x: number;
  y: number;
};

type Draggable = [Position, React.Dispatch<React.SetStateAction<Position>>];

const useDraggable = (
  maximized: boolean = false,
  position: Position = DEFAULT_WINDOW_POSITION
): Draggable => {
  const [{ x, y }, setPosition] = useState<Position>(position);

  return [
    {
      x: maximized ? 0 : x,
      y: maximized ? 0 : y
    },
    setPosition
  ];
};

export default useDraggable;
