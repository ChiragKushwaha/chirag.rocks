import { TIconProps } from '../types';

const Cross = (props: TIconProps) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursors/Cross</title>
      <g
        id="Cursors/Cross"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Cursors-/-Cross" transform="translate(9, 9)" fillRule="nonzero">
          <polygon
            id="Cross-Outline"
            fill="#FFFFFF"
            points="15 6 8.99 6 8.99 0 6.01 0 6.01 6 0 6 0 9 6.01 9 6.01 15 8.99 15 8.99 9 15 9"
          ></polygon>
          <polygon
            id="Cross"
            fill="#231F1F"
            points="13.9902 7.0103 7.9902 7.0103 7.9902 1.0003 7.0102 1.0003 7.0102 7.0103 1.0102 7.0103 1.0102 7.9903 7.0102 7.9903 7.0102 14.0003 7.9902 14.0003 7.9902 7.9903 13.9902 7.9903"
          ></polygon>
        </g>
      </g>
    </svg>
  );
};

export default Cross;
