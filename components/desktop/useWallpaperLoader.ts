import { useEffect } from "react";

interface WallpaperLoaderProps {
  wallpaperUrl: string | null;
  assetsReady: boolean;
  isBooting: boolean;
  setBooting: (booting: boolean) => void;
  setBootProgress: (progress: number) => void;
}

export function useWallpaperLoader({
  wallpaperUrl,
  assetsReady,
  isBooting,
  setBooting,
  setBootProgress,
}: WallpaperLoaderProps) {
  useEffect(() => {
    if (!isBooting) return;

    if (!assetsReady) {
      setBootProgress(20);
      return;
    }

    setBootProgress(50);

    if (!wallpaperUrl) {
      const timer = setTimeout(() => {
        setBootProgress(100);
        setTimeout(() => setBooting(false), 300);
      }, 1000);
      return () => clearTimeout(timer);
    }

    const img = new Image();
    img.src = wallpaperUrl;

    const timeout = setTimeout(() => {
      setBootProgress(100);
      setTimeout(() => setBooting(false), 300);
    }, 4000);

    img.onload = () => {
      clearTimeout(timeout);
      setBootProgress(100);
      setTimeout(() => setBooting(false), 300);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      setBootProgress(100);
      setTimeout(() => setBooting(false), 300);
    };

    return () => clearTimeout(timeout);
  }, [isBooting, assetsReady, wallpaperUrl, setBooting, setBootProgress]);
}
