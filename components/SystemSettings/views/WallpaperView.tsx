import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Plus } from "lucide-react";
import Image from "next/image";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useSystemStore } from "../../../store/systemStore";
import { WallpaperManager } from "../../../lib/WallpaperManager";

interface Wallpaper {
  name: string;
  baseName: string;
  variants: {
    light?: string;
    dark?: string;
    standard?: string;
  };
}

export const WallpaperView = () => {
  const { theme, wallpaperName, setWallpaperName } = useSystemStore();
  const isDark = theme === "dark";
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  useEffect(() => {
    WallpaperManager.getWallpapersFromOPFS().then(setWallpapers);
  }, []);

  const currentWallpaper = wallpapers.find((w) => w.baseName === wallpaperName);
  const currentVariant = isDark
    ? currentWallpaper?.variants.dark || currentWallpaper?.variants.standard
    : currentWallpaper?.variants.light || currentWallpaper?.variants.standard;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <ImageIcon size={32} className="text-cyan-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">Wallpaper</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose a desktop picture.
          </p>
        </div>
      </div>

      <div className="flex gap-6 items-center px-4">
        <div className="w-48 aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden relative border border-gray-300 dark:border-gray-600 shadow-sm shrink-0">
          {currentVariant && (
            <Image
              src={currentVariant}
              alt="Current Wallpaper"
              fill
              className="object-cover"
              unoptimized
            />
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center gap-2">
          <h3 className="font-medium dark:text-white">
            {currentWallpaper?.name || "Wallpaper"}
          </h3>
          <SettingsRow label="Show on all Spaces" type="toggle" value={true} />
        </div>
      </div>

      <SettingsGroup title="Dynamic Wallpapers">
        <div className="grid grid-cols-4 gap-4 p-4">
          {wallpapers.map((wp) => {
            const variantToShow = isDark
              ? wp.variants.dark || wp.variants.standard
              : wp.variants.light || wp.variants.standard;

            const isSelected = wallpaperName === wp.baseName;

            return (
              <button
                key={wp.baseName}
                onClick={() => setWallpaperName(wp.baseName)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  isSelected
                    ? "border-blue-500 shadow-md ring-2 ring-blue-500/20"
                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Image
                  src={variantToShow as string}
                  alt={wp.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 backdrop-blur-sm">
                  {wp.name}
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </SettingsGroup>

      <SettingsGroup title="Pictures">
        <div className="p-4 grid grid-cols-4 gap-4">
          <button className="aspect-square bg-gray-100 dark:bg-white/5 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-dashed border-gray-300 dark:border-gray-600">
            <Plus size={24} />
            <span className="text-xs">Add Photo</span>
          </button>
        </div>
      </SettingsGroup>
    </div>
  );
};
