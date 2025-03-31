'use client';
import WAVES from '@/libs/vanta.waves.min';
import { useEffect } from 'react';
import * as THREE from 'three';

const disableControls = {
  mouseControls: true,
  touchControls: true
};
const settings = {
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 1.0,
  scaleMobile: 1.0
};
const isWebGLAvailable = typeof WebGLRenderingContext != 'undefined';

const useWallpaper = (desktopRef: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const element = desktopRef.current;
    const vantaEffect =
      element && isWebGLAvailable
        ? //@ts-expect-error WAVES does not have types//
          WAVES({
            el: desktopRef.current,
            THREE,
            ...disableControls,
            ...settings
          })
        : undefined;

    if (vantaEffect == undefined) {
      if (element) {
        element.style.backgroundImage = "url('/wallpapers/wallpaper.jpg')";
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        element.style.width = '100vw';
        element.style.height = '100vh';
      }
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [desktopRef]);
};

export default useWallpaper;
