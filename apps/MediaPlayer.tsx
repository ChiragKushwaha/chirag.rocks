import React, { useEffect, useState } from "react";
import { useAsset } from "../components/hooks/useIconManager";

interface MediaPlayerProps {
  initialPath?: string;
  initialFilename?: string;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  initialPath,
  initialFilename,
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const assetUrl = useAsset(`${initialPath}/${initialFilename}`);

  useEffect(() => {
    if (assetUrl) {
      setUrl(assetUrl);
    }
  }, [assetUrl]);

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        Loading...
      </div>
    );
  }

  const isVideo =
    initialFilename?.endsWith(".mp4") || initialFilename?.endsWith(".mov");

  return (
    <div className="flex flex-col h-full w-full bg-black items-center justify-center">
      {isVideo ? (
        <video src={url} controls className="max-w-full max-h-full" autoPlay />
      ) : (
        <audio src={url} controls className="w-full max-w-md" autoPlay />
      )}
    </div>
  );
};
