import React from "react";
import Image from "next/image";
import { WallpaperCurrentPreviewProps } from "./types";

export const WallpaperCurrentPreview: React.FC<WallpaperCurrentPreviewProps> = ({
  currentWallpaperName,
  currentVariant,
  showOnAllSpacesLabel,
}) => {
  const isDirect =
    !currentVariant ||
    currentVariant.startsWith("blob:") ||
    currentVariant.startsWith("data:") ||
    currentVariant.startsWith("http");

  return (
    <div className="flex gap-6 items-center px-4 py-3 bg-black/[0.03] dark:bg-white/[0.04] rounded-2xl border border-black/5 dark:border-white/5">
      <div className="w-48 aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden relative border border-gray-300 dark:border-gray-600 shadow-md shrink-0">
        {currentVariant && (
          <Image
            src={currentVariant}
            alt="Current Wallpaper"
            fill
            className="object-cover transition-opacity duration-300"
            unoptimized={isDirect}
          />
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2.5">
        <h3 className="font-semibold text-[16px] text-gray-900 dark:text-gray-100">
          {currentWallpaperName || "Wallpaper"}
        </h3>
        <div className="flex items-center justify-between pr-2">
          <span className="text-[13px] text-gray-600 dark:text-gray-300 font-medium">
            {showOnAllSpacesLabel}
          </span>
          <div className="w-9 h-5 bg-[#34C759] rounded-full p-0.5 shadow-sm flex items-center cursor-pointer shrink-0">
            <div className="w-4 h-4 bg-white rounded-full shadow translate-x-4 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
