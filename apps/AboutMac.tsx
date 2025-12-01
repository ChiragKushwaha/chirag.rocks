import React, { useEffect, useState } from "react";

export const AboutMac: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState({
    platform: "Unknown",
    memory: "Unknown",
    cores: "Unknown",
  });

  useEffect(() => {
    const getSystemInfo = async () => {
      let memory = "Unknown";
      let cores = "Unknown";
      let platform = navigator.platform;

      // @ts-ignore - navigator.deviceMemory is non-standard but supported in Chrome
      if (navigator.deviceMemory) {
        // @ts-ignore
        memory = `${navigator.deviceMemory} GB`;
      }

      if (navigator.hardwareConcurrency) {
        cores = `${navigator.hardwareConcurrency}`;
      }

      setSystemInfo({
        platform,
        memory,
        cores,
      });
    };

    getSystemInfo();
  }, []);

  return (
    <div className="w-full h-full bg-[#ECECEC] dark:bg-[#2b2b2b] flex flex-col items-center p-8 select-none font-sans text-gray-900 dark:text-gray-100">
      <div className="flex w-full max-w-2xl gap-8 items-start">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 shadow-lg flex items-center justify-center border border-white/20">
            <span className="text-7xl text-gray-500 dark:text-gray-400"></span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 pt-2">
          <div className="mb-6">
            <h1 className="text-3xl font-light tracking-tight mb-1">
              macOS <span className="font-bold">Big Sur</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Version 11.0.1
            </p>
          </div>

          <div className="space-y-1 text-xs mb-6">
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-bold text-right">MacBook Pro</span>
              <span>(13-inch, M1, 2020)</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-bold text-right">Processor</span>
              <span>{systemInfo.cores} Core Intel Core i9 (Simulated)</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-bold text-right">Memory</span>
              <span>{systemInfo.memory}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-bold text-right">Startup Disk</span>
              <span>Macintosh HD</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-bold text-right">Graphics</span>
              <span>Intel UHD Graphics 630 1536 MB</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <span className="font-bold text-right">Serial Number</span>
              <span>C02XV0J0JG5J</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-3 py-1 bg-white dark:bg-[#3a3a3a] border border-gray-300 dark:border-gray-600 rounded shadow-sm text-xs font-medium active:bg-gray-100 dark:active:bg-[#444]">
              System Report...
            </button>
            <button className="px-3 py-1 bg-white dark:bg-[#3a3a3a] border border-gray-300 dark:border-gray-600 rounded shadow-sm text-xs font-medium active:bg-gray-100 dark:active:bg-[#444]">
              Software Update...
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto text-[10px] text-gray-400">
        TM and © 1983-2025 Apple Inc. All Rights Reserved. License and Warranty
      </div>
    </div>
  );
};
