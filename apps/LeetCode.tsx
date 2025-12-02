import React, { useState } from "react";
import { RotateCw, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

export const LeetCode = () => {
  const [isLoading, setIsLoading] = useState(true);
  const url = "https://leetcode.com/u/ChiragKushwaha/";

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white font-sans">
      {/* Toolbar */}
      <div className="h-10 bg-[#2b2b2b] border-b border-black/20 flex items-center px-4 gap-4">
        <div className="flex gap-2 text-gray-400">
          <ArrowLeft size={16} className="cursor-pointer hover:text-white" />
          <ArrowRight size={16} className="cursor-pointer hover:text-white" />
        </div>

        <div className="flex-1 flex justify-center">
          <div className="bg-[#1e1e1e] px-4 py-1 rounded text-xs text-gray-400 flex items-center gap-2">
            <span className="truncate max-w-[200px]">{url}</span>
          </div>
        </div>

        <div className="flex gap-3 text-gray-400">
          <RotateCw
            size={14}
            className="cursor-pointer hover:text-white"
            onClick={() => {
              const iframe = document.getElementById(
                "leetcode-frame"
              ) as HTMLIFrameElement;
              if (iframe) iframe.src = iframe.src;
            }}
          />
          <ExternalLink
            size={14}
            className="cursor-pointer hover:text-white"
            onClick={() => window.open(url, "_blank")}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        )}
        <iframe
          id="leetcode-frame"
          src={url}
          className="w-full h-full border-none"
          title="LeetCode Profile"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};
