import { TIconProps } from '../../types';

const North = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Resize (Single)/North</title>
      <g
        id="Cursors/Resize-(Single)/North"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Resize-(Single)-/-North"
          transform="translate(10, 10)"
          fillRule="nonzero"
        >
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            points="12 6 6 0 0 6 4 6 4 13 8 13 8 6"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            points="5 12 5 5 2.414 5 6 1.414 9.586 5 7 5 7 12"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default North;
