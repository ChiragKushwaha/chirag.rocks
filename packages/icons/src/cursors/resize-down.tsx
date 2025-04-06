import { TIconProps } from '../types';

const ResizeDown = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Resize (Down)</title>
      <g
        id="Cursors/Resize-(Down)"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Resize-(Down)"
          transform="translate(8, 11)"
          fillRule="nonzero"
        >
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            points="0 0.0005 0 3.9805 6.006 3.9805 6.006 5.0395 2.54 5.0395 8.012 11.0005 13.473 5.0395 9.995 5.0395 9.995 3.9805 16 3.9805 16 0.0005"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            points="1 2.98 7 2.98 7 6.02 4.76 6.02 8.011 9.34 11.234 6.02 8.98 6.02 8.98 2.98 14.98 2.98 14.98 1.02 1 1.02"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default ResizeDown;
