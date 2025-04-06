import { TIconProps } from '../types';

const Busy = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Busy</title>
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
          x1="100%"
          y1="100%"
          x2="0%"
          y2="1.72254642e-14%"
          id="linearGradient-2"
        >
          <stop stopColor="#4A85C7" offset="0%"></stop>
          <stop stopColor="#3C7AB7" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="100%"
          y1="100%"
          x2="0%"
          y2="1.72254642e-14%"
          id="linearGradient-3"
        >
          <stop stopColor="#5EC9F3" offset="0%"></stop>
          <stop stopColor="#47C3F1" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="-1.11022302e-14%"
          y1="1.72254642e-14%"
          x2="100%"
          y2="100%"
          id="linearGradient-4"
        >
          <stop stopColor="#86D1F6" offset="0%"></stop>
          <stop stopColor="#67CAF3" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          id="linearGradient-5"
        >
          <stop stopColor="#5595D3" offset="0%"></stop>
          <stop stopColor="#4B89C6" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g
        id="Cursors/Busy"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Busy"
          filter="url(#filter-1)"
          transform="translate(7, 0)"
        >
          <g id="Busy" transform="translate(1, 14)">
            <path
              d="M18,9 L18,18 L9,18 C9,13.0294373 13.0294373,9 18,9 Z"
              id="Segment-4"
              fill="url(#linearGradient-2)"
              transform="translate(13.5, 13.5) rotate(180) translate(-13.5, -13.5)"
            ></path>
            <path
              d="M9,9 L9,18 L0,18 C0,13.0294373 4.02943725,9 9,9 Z"
              id="Segment-3"
              fill="url(#linearGradient-3)"
              transform="translate(4.5, 13.5) rotate(270) translate(-4.5, -13.5)"
            ></path>
            <path
              d="M18,0 L18,9 L9,9 C9,4.02943725 13.0294373,0 18,0 Z"
              id="Segment-2"
              fill="url(#linearGradient-4)"
              transform="translate(13.5, 4.5) rotate(90) translate(-13.5, -4.5)"
            ></path>
            <path
              d="M9,0 L9,9 L0,9 C0,4.02943725 4.02943725,0 9,0 Z"
              id="Segment-1"
              fill="url(#linearGradient-5)"
            ></path>
            <circle
              id="Border"
              stroke="#000000"
              strokeWidth="0.5"
              opacity="0.200000003"
              cx="9"
              cy="9"
              r="8.75"
            ></circle>
          </g>
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            fillRule="nonzero"
            points="0 16.4219 0 0.4069 11.591 12.0259 4.55 12.0259 4.399 12.1499"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            fillRule="nonzero"
            points="1 2.814 1 14.002 3.969 11.136 4.129 10.997 9.165 10.997"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default Busy;
