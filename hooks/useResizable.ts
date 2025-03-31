import { useCallback, useState } from 'react';
import type { RndResizeCallback } from 'react-rnd';

type Size = {
  width: string;
  height: string;
};
const defaultWindowSize: Size = {
  height: '200px',
  width: '250px'
};

const useResizable = (maximized: boolean = false) => {
  const [size, setSize] = useState<Size>(defaultWindowSize);
  const updateSize = useCallback<RndResizeCallback>(
    (_event, _direction, ref) => {
      setSize({ width: ref.style.width, height: ref.style.height });
    },
    []
  );

  return {
    size: {
      height: maximized ? '100%' : size.height,
      width: maximized ? '100%' : size.width
    },
    updateSize
  };
};

export default useResizable;
