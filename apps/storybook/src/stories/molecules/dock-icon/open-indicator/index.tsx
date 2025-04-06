import React from 'react';

const OpenIndicator = ({ variant }: { variant: 'light' | 'dark' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="4"
      viewBox="0 0 4 4"
      fill="none"
    >
      <g
        style={{
          mixBlendMode: 'plus-lighter'
        }}
      >
        <circle
          cx="2"
          cy="2"
          r="2"
          fill={variant == 'light' ? '#808080' : '#7C7C7C'}
        />
      </g>
    </svg>
  );
};

export default OpenIndicator;
