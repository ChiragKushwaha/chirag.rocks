import { TIconProps } from '../../types';

const East = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Resize (Single)/East</title>
      <g
        id="Cursors/Resize-(Single)/East"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Resize-(Single)-/-East"
          transform="translate(10, 10)"
          fillRule="nonzero"
        >
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            points="7 12 13 6 7 0 7 4 0 4 0 8 7 8"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            points="1 5 8 5 8 2.414 11.586 6 8 9.586 8 7 1 7"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default East;
