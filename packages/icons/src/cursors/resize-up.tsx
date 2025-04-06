import { TIconProps } from '../types';

const ResizeUp = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Resize (Up)</title>
      <g
        id="Cursors/Resize-(Up)"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Resize-(Up)"
          transform="translate(8, 10)"
          fillRule="nonzero"
        >
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            points="2.5273 6.9614 6.0053 6.9614 6.0053 8.0194 0.0003 8.0194 0.0003 12.0004 16.0003 12.0004 16.0003 8.0194 9.9943 8.0194 9.9943 6.9614 13.4613 6.9614 7.9883 0.9994"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            points="15 9.0195 9 9.0195 9 5.9805 11.24 5.9805 7.989 2.6605 4.766 5.9805 7.02 5.9805 7.02 9.0195 1.02 9.0195 1.02 10.9805 15 10.9805"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default ResizeUp;
