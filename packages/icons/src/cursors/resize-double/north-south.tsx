import React from 'react';
import { TIconProps } from '../../types';

const NorthSouth = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Resize (Double)/North-South</title>
      <g
        id="Cursors/Resize-(Double)/North-South"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Resize-(Double)-/-North-South"
          transform="translate(10, 8)"
          fillRule="nonzero"
        >
          <path
            d="M6,0 L0,5.98 L4,5.98 L4,8 L4,10 L0,10 L6,16 L12,10 L8,10 L8,8 L8,5.98 L12,5.98 L6,0 Z M6,1.414 L9.586,4.981 L7,4.981 L7,7.501 L7,11 L9.586,11 L6,14.586 L2.414,11 L5,11 L5,7.501 L5,4.981 L2.414,4.981 L6,1.414 Z"
            id="Arrows-Outline"
            fill="#FFFFFF"
          ></path>
          <polygon
            id="Arrows"
            fill="#000000"
            points="7 7.5 7 4.98 9.586 4.98 6 1.414 2.414 4.98 5 4.98 5 7.5 5 11 2.414 11 6 14.586 9.586 11 7 11"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default NorthSouth;
