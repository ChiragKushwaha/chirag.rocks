import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

export const MacOSDisclosure: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[13px] text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 -ml-1 py-0.5 w-full text-left"
      >
        <ChevronRight
          size={12}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
        <span className="font-medium">{title}</span>
      </button>
      {isOpen && <div className="pl-4 mt-1">{children}</div>}
    </div>
  );
};
