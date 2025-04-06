import { TIconProps } from '../types';

const ZoomOut = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Zoom Out</title>
      <defs>
        <filter
          x="-9.4%"
          y="-9.4%"
          width="118.7%"
          height="118.8%"
          filterUnits="objectBoundingBox"
          id="filter-1"
        >
          <feOffset
            dx="0"
            dy="0"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feGaussianBlur
            stdDeviation="0.5"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          ></feGaussianBlur>
          <feColorMatrix
            values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.798253676 0"
            type="matrix"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          ></feColorMatrix>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
      <g
        id="Cursors/Zoom-Out"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Zoom-Out"
          filter="url(#filter-1)"
          transform="translate(8, 8)"
        >
          <path
            d="M11.5,6 C11.5,9.038 9.038,11.5 6,11.5 C2.962,11.5 0.5,9.038 0.5,6 C0.5,2.962 2.962,0.5 6,0.5 C9.038,0.5 11.5,2.962 11.5,6"
            id="Fill"
            fill="#FFFFFF"
          ></path>
          <path
            d="M15.9999,14.586 L14.5859,16 L9.47674999,10.89085 C8.49594405,11.5892679 7.29601194,12 6,12 C2.68585763,12 0,9.31414237 0,6 C0,2.68585763 2.68585763,0 6,0 C9.31414237,0 12,2.68585763 12,6 C12,7.29606339 11.5892353,8.49603933 10.8907668,9.4768668 L15.9999,14.586 Z M6,1 C8.76185763,1 11,3.23814237 11,6 C11,8.76185763 8.76185763,11 6,11 C3.23814237,11 1,8.76185763 1,6 C1,3.23814237 3.23814237,1 6,1 Z M9,5 L3,5 L3,6.98 L9,6.98 L9,5 Z"
            id="Outline"
            fill="#000000"
          ></path>
        </g>
      </g>
    </svg>
  );
};

export default ZoomOut;
