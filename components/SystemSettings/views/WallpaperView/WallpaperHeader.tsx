import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { WallpaperHeaderProps } from "./types";

export const WallpaperHeader: React.FC<WallpaperHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-md">
        <ImageIcon size={28} className="text-white" />
      </div>
      <div>
        <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};
