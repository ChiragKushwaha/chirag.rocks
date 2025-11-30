import React from "react";

interface BootScreenProps {
  progress: number; // 0 to 100
}

export const BootScreen: React.FC<BootScreenProps> = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] cursor-none select-none">
      {/* Apple Logo */}
      <div
        className="mb-12 text-white text-[80px] leading-none select-none"
        style={{
          textShadow: "0 0 10px rgba(255,255,255,0.1)",
        }}
      >
        
      </div>

      {/* Progress Bar */}
      <div className="w-[240px] h-[6px] bg-[#424242] rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-200 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
};
