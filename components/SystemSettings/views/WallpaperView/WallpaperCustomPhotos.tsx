import React, { useRef } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { SettingsGroup } from "../../SettingsGroup";
import { WallpaperCustomPhotosProps } from "./types";

export const WallpaperCustomPhotos: React.FC<WallpaperCustomPhotosProps> = ({
  title,
  addPhotoLabel,
  customWallpapers,
  currentWallpaperName,
  onSelect,
  onAddPhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddPhoto(file);
      e.target.value = "";
    }
  };

  return (
    <SettingsGroup title={title}>
      <div className="p-4 grid grid-cols-4 gap-4">
        {customWallpapers.map((wp) => {
          const isSelected = currentWallpaperName === wp.baseName;
          const src = wp.variants.standard;
          const isDirect =
            !src ||
            src.startsWith("blob:") ||
            src.startsWith("data:") ||
            src.startsWith("http");

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
              {src && (
                <Image
                  src={src}
                  alt={wp.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized={isDirect}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-0.5 truncate backdrop-blur-md">
                {wp.name}
              </div>
            </button>
          );
        })}

        <button
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video bg-gray-100 dark:bg-white/5 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-dashed border-gray-300 dark:border-gray-600"
        >
          <Plus size={22} />
          <span className="text-xs font-medium">{addPhotoLabel}</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </SettingsGroup>
  );
};
