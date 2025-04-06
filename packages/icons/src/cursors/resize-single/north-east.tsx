import { TIconProps } from '../../types';

const NorthEast = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Resize (Single)/North-East</title>
      <g
        id="Cursors/Resize-(Single)/North-East"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Cursors-/-Resize-(Single)-/-North-East"
          transform="translate(11, 11)"
          fillRule="nonzero"
        >
          <polygon
            id="Arrow-Outline"
            fill="#FFFFFF"
            points="11 8.4863 11 0.0003 2.515 0.0003 5.344 2.8293 0.394 7.7793 3.222 10.6073 8.172 5.6573"
          ></polygon>
          <polygon
            id="Arrow"
            fill="#000000"
            points="1.8081 7.7793 6.7581 2.8283 4.9301 1.0003 10.0011 1.0003 10.0011 6.0713 8.1721 4.2423 3.2221 9.1933"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default NorthEast;
