import { TIconProps } from '../../types';

const NorthWest = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Resize (Single)/North-West</title>
      <g
        id="Cursors/Resize-(Single)/North-West"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Resize-(Single)-/-North-West"
          transform="translate(11, 11)"
          fillRule="nonzero"
        >
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            points="0 0 0 8.485 2.829 5.656 7.78 10.605 10.607 7.778 5.657 2.829 8.486 0"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            points="7.7793 9.1914 2.8283 4.2424 1.0003 6.0704 1.0003 0.9994 6.0713 0.9994 4.2423 2.8284 9.1933 7.7774"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default NorthWest;
