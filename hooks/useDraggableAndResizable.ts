import { useCallback, useState } from 'react';
import type { RndDragCallback, RndResizeCallback } from 'react-rnd';

type Size = {
  width: string;
  height: string;
};

type Position = {
  x: number;
  y: number;
};

type Draggable = {
  position: Position;
  updatePosition: RndDragCallback;
};

type Resizable = {
  size: Size;
  updateSize: RndResizeCallback;
};

type DraggableAndResizable = Draggable & Resizable;

const defaultWindowSize: Size = {
  height: '200px',
  width: '250px'
};

const defaultWindowPosition: Position = { x: 0, y: 0 };

const useDraggableAndResizable = (
  maximized: boolean = false
): DraggableAndResizable => {
  const [size, setSize] = useState<Size>(defaultWindowSize);
  const [position, setPosition] = useState<Position>(defaultWindowPosition);

  const updatePosition = useCallback<RndDragCallback>((_event, data) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

  const updateSize = useCallback<RndResizeCallback>(
    (_event, _direction, ref, _delta, position) => {
      setSize({ width: ref.style.width, height: ref.style.height });
      setPosition({ x: position.x, y: position.y });
    },
    []
  );

  return {
    position: {
      x: maximized ? 0 : position.x,
      y: maximized ? 0 : position.y
    },
    updatePosition,
    size: {
      height: maximized ? '100%' : size.height,
      width: maximized ? '100%' : size.width
    },
    updateSize
  };
};

export default useDraggableAndResizable;
