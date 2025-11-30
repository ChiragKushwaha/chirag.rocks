import React from "react";
import { ChevronRight } from "lucide-react";

export const MacOSPathControl: React.FC<{ path: string }> = ({ path }) => {
  const parts = path.split("/").filter(Boolean);
  return (
    <div className="flex items-center gap-1 text-[12px] text-gray-600 dark:text-gray-400 select-none">
      <span className="font-medium text-black dark:text-white">
        Macintosh HD
      </span>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={10} className="opacity-50" />
          <span className="hover:bg-black/5 dark:hover:bg-white/10 px-1 rounded cursor-default">
            {part}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};
