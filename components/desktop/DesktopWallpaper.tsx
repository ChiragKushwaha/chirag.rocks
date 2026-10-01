import React from "react";
import NextImage from "next/image";

interface DesktopWallpaperProps {
  src: string;
  brightness: number;
}

export const DesktopWallpaper: React.FC<DesktopWallpaperProps> = ({
  src,
  brightness,
}) => {
  return (
    <div className="absolute inset-0 z-0">
      <NextImage
        src={src}
        alt="Wallpaper"
        fill
        priority
        className="object-cover transition-all duration-1000 ease-in-out"
        style={{ filter: `brightness(${brightness}%)` }}
        unoptimized={!!src?.startsWith("blob:")}
        quality={90}
      />
    </div>
  );
};
