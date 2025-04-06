import Dark from '../../assets/dock-background/Dark.svg';
import Light from '../../assets/dock-background/Light.svg';
const Dock = ({ variant }: { variant: 'light' | 'dark' }) => {
  return variant === 'light' ? (
    <img width={65} height={65} src={Light} alt="Light" />
  ) : (
    <img width={65} height={65} src={Dark} alt="Dark" />
  );
};

export default Dock;
