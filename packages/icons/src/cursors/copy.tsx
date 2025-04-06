import { TIconProps } from '../types';

const Copy = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Copy</title>
      <defs>
        <filter
          x="-18.4%"
          y="-6.5%"
          width="136.8%"
          height="120.6%"
          filterUnits="objectBoundingBox"
          id="filter-1"
        >
          <feOffset
            dx="0"
            dy="1"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feGaussianBlur
            stdDeviation="1"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          ></feGaussianBlur>
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.404900046 0"
            type="matrix"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          ></feColorMatrix>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
        <linearGradient
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
          id="linearGradient-2"
        >
          <stop stopColor="#5BD230" offset="0%"></stop>
          <stop stopColor="#068B03" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g
        id="Cursors/Copy"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Copy"
          filter="url(#filter-1)"
          transform="translate(7, 0)"
          fillRule="nonzero"
        >
          <g id="Copy" transform="translate(1, 14)">
            <path
              d="M0,9 C0,13.97 4.03,18 9,18 L9,18 C13.97,18 18,13.97 18,9 L18,9 C18,4.029 13.97,0 9,0 L9,0 C4.03,0 0,4.029 0,9"
              id="Disc"
              fill="url(#linearGradient-2)"
            ></path>
            <path
              d="M13,8 L10,8 L10,5 C10,4.448 9.552,4 9,4 C8.448,4 8,4.448 8,5 L8,8 L5,8 C4.448,8 4,8.448 4,9 C4,9.552 4.448,10 5,10 L8,10 L8,13 C8,13.552 8.448,14 9,14 C9.552,14 10,13.552 10,13 L10,10 L13,10 C13.552,10 14,9.552 14,9 C14,8.448 13.552,8 13,8"
              id="Plus"
              fill="#FFFFFF"
            ></path>
          </g>
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            points="0 16.4219 0 0.4069 11.591 12.0259 4.55 12.0259 4.399 12.1499"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            points="1 2.814 1 14.002 3.969 11.136 4.129 10.997 9.165 10.997"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default Copy;
