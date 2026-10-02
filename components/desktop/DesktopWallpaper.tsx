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
  const isDirect = !src || src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("http");

  return (
    <div className="absolute inset-0 z-0">
      <NextImage
        src={src}
        alt="Wallpaper"
        fill
        priority
        className="object-cover transition-all duration-700 ease-in-out"
        style={{ filter: `brightness(${brightness}%)` }}
        unoptimized={isDirect}
        quality={90}
      />
    </div>
  );
};
