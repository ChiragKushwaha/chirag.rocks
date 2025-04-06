import { TIconProps } from '../types';

const ResizeLeft = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Resize (Left)</title>
      <g
        id="Cursors/Resize-(Left)"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Resize-(Left)"
          transform="translate(11, 8)"
          fillRule="nonzero"
        >
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            points="7.02 0 7.02 6.006 6 6.006 6 2.14 0 8.012 6 13.902 6 9.995 7.02 9.995 7.02 16 11 16 11 0"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            points="8 1 8 7 4.98 7 4.98 4.76 1.66 8.011 4.98 11.234 4.98 8.98 8 8.98 8 14.98 9.98 14.98 9.98 1"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default ResizeLeft;
