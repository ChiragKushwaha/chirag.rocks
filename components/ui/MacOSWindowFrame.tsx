import React from "react";

// --- MACOS WINDOW FRAME ---
// The standard modal window container
export const MacOSWindowFrame: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
}> = ({ children, width = 780, height = 560, className = "" }) => (
  <div
    style={{ width, height }}
    className={`
      relative flex flex-col overflow-hidden
      bg-[#F6F6F6]/90 dark:bg-[#282828]/90 backdrop-blur-2xl
      rounded-[10px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]
      border border-black/10 dark:border-white/10
      animate-in zoom-in-95 duration-200
      ${className}
    `}
  >
    {/* Inner Stroke for high-res displays (imitates standard window border) */}
    <div className="absolute inset-0 rounded-[10px] border border-white/20 pointer-events-none" />
    {children}
  </div>
);
