import Image from 'next/image';
import React from 'react';
import Dark from '../../assets/dock-background/Dark.svg';
import Light from '../../assets/dock-background/Light.svg';
const Dock = ({ variant }: { variant: 'light' | 'dark' }) => {
  return variant === 'light' ? (
    <Image width={65} height={65} src={Light} alt="Light" />
  ) : (
    <Image width={65} height={65} src={Dark} alt="Dark" />
  );
};

export default Dock;
