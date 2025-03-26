'use client';
import WAVES from '@/public/libs/vanta.waves.min';
import { useEffect } from 'react';
import * as THREE from 'three';

const useWallpaper = (desktopRef: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const vantaEffect = WAVES({
      el: desktopRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0
    });

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [desktopRef]);
  // useEffect(() => {
  //   if (desktopRef.current) {
  //     desktopRef.current.style.backgroundImage =
  //       "url('/wallpapers/wallpaper.jpg')";
  //     desktopRef.current.style.backgroundSize = 'cover';
  //     desktopRef.current.style.backgroundPosition = 'center';
  //     desktopRef.current.style.width = '100vw';
  //     desktopRef.current.style.height = '100vh';
  //   }
  // }, [desktopRef]);
};

export default useWallpaper;
