import React from "react";
import { Monitor } from "lucide-react";

export const AboutMac: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#ECECEC] flex flex-col items-center justify-center p-8 select-none">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <span className="text-5xl"></span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">macOS Web</h1>
      <p className="text-gray-500 text-sm font-medium mb-6">
        Version 14.4.1 (Simulated)
      </p>

      <div className="w-full max-w-xs space-y-2 text-[11px] text-gray-600 bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
        <div className="flex justify-between">
          <span className="font-bold">Processor</span>
          <span>Apple M3 Max (Virtual)</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Memory</span>
          <span>128 GB</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Startup Disk</span>
          <span>Macintosh HD (OPFS)</span>
        </div>
      </div>

      <div className="mt-6 flex gap-4 text-[11px]">
        <button className="bg-white border border-gray-300 px-3 py-1 rounded shadow-sm active:bg-gray-100">
          System Report...
        </button>
        <button className="bg-white border border-gray-300 px-3 py-1 rounded shadow-sm active:bg-gray-100">
          Software Update...
        </button>
      </div>
    </div>
  );
};
