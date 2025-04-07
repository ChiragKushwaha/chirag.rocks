const Separator = ({ variant }: { variant: 'light' | 'dark' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="64"
      viewBox="0 0 22 64"
      fill="none"
    >
      <g style={{ mixBlendMode: 'plus-lighter' }}>
        <rect
          x="10.5"
          y="9"
          width="1"
          height="45"
          rx="0.5"
          fill={variant === 'light' ? '#E8E8E8' : '#414141'}
        />
      </g>
    </svg>
  );
};

export default Separator;
