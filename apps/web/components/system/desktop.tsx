'use client';
import Script from 'next/script';
import { useRef } from 'react';
import useWallpaper from '../../hooks/useWallpaper';

const Desktop = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const desktopRef = useRef<HTMLElement>(null);

  useWallpaper(desktopRef);

  return (
    <>
      <Script src="libs/vanta.waves.min.js" strategy="beforeInteractive" />
      <main
        className="w-screen h-screen fixed top-0 left-0 bottom-0 right-0"
        ref={desktopRef}
      >
        {children}
      </main>
    </>
  );
};

export default Desktop;
