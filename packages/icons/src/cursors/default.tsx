import React from 'react';
import { TIconProps } from '../types';

const Default = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Default</title>
      <defs>
        <filter
          x="-29.1%"
          y="-11.0%"
          width="153.2%"
          height="131.9%"
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
      </defs>
      <g
        id="Cursors/Default"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Default"
          filter="url(#filter-1)"
          transform="translate(10, 7)"
        >
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            points="6.14752776 18.4727 8.01052776 17.4697 9.62552776 16.6307 7.05752776 11.8147 11.3895278 11.8147 0.0105277614 0.4067 0.0105277614 16.4217 3.32652776 13.2007"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            points="6.4308 16.9996 8.1958 16.0586 5.42146596 10.857 9.025 10.857 1 2.814 1 14.002 3.52983647 11.559908"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default Default;
