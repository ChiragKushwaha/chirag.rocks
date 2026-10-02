import React from "react";
import Image from "next/image";
import { SettingsGroup } from "../../SettingsGroup";
import { WallpaperGridProps } from "./types";

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  title,
  wallpapers,
  currentWallpaperName,
  isDark,
  onSelect,
}) => {
  return (
    <SettingsGroup title={title}>
      <div className="grid grid-cols-4 gap-4 p-4">
        {wallpapers.map((wp) => {
          const variant = isDark
            ? wp.variants.dark || wp.variants.standard
            : wp.variants.light || wp.variants.standard;
          const isSelected = currentWallpaperName === wp.baseName;
          const isDirect =
            !variant ||
            variant.startsWith("blob:") ||
            variant.startsWith("data:") ||
            variant.startsWith("http");

          return (
            <button
              key={wp.baseName}
              onClick={() => onSelect(wp.baseName)}
              className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all focus:outline-none ${
                isSelected
                  ? "border-blue-500 shadow-lg ring-2 ring-blue-500/30 scale-[1.02]"
                  : "border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:scale-[1.01]"
              }`}
            >
              {variant && (
                <Image
                  src={variant}
                  alt={wp.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized={isDirect}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[11px] font-medium px-2 py-1 backdrop-blur-md">
                {wp.name}
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </SettingsGroup>
  );
};
