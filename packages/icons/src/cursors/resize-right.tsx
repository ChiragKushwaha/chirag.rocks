import { TIconProps } from '../types';

const ResizeRight = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Resize (Right)</title>
      <g
        id="Cursors/Resize-(Right)"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Resize-(Right)"
          transform="translate(11, 8)"
          fillRule="nonzero"
        >
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            points="0.0005 0 0.0005 16 3.9805 16 3.9805 9.994 5.0395 9.994 5.0395 13.461 11.0005 7.988 5.0395 2.527 5.0395 6.005 3.9805 6.005 3.9805 0"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            points="3 14.9805 3 8.9805 6.02 8.9805 6.02 11.2405 9.34 7.9885 6.02 4.7655 6.02 7.0195 3 7.0195 3 1.0195 1.02 1.0195 1.02 14.9805"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default ResizeRight;
