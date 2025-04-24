import { useState } from 'react';
import { pxToNumber } from '../utils/string-functions';
import { DEFAULT_WINDWOW_SIZE } from '../utils/constants';

export type Size = {
  width: string;
  height: string;
};

type Resizable = [Size, React.Dispatch<React.SetStateAction<Size>>];

const useResizable = (
  maximized: boolean = false,
  size: Size = DEFAULT_WINDWOW_SIZE
): Resizable => {
  const [{ height, width }, setSize] = useState<Size>(size);

  const tasbarHeight = '40px';

  return [
    {
      height: maximized
        ? `${window.innerHeight - pxToNumber(tasbarHeight)}px`
        : height,
      width: maximized ? '100%' : width
    },
    setSize
  ];
};

export default useResizable;
