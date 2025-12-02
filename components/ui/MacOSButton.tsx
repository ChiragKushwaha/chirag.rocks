import React from "react";

// --- MACOS BUTTON ---
// Matches the standard "Push Button" found in macOS dialogs
interface MacOSButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive";
  size?: "default" | "large";
}

export const MacOSButton: React.FC<MacOSButtonProps> = ({
  variant = "secondary",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const baseStyles = `
    font-sans font-medium rounded-[5px] border shadow-sm transition-all duration-100 ease-out 
    focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 select-none
    flex items-center justify-center gap-1.5
  `;

  const sizeStyles =
    size === "large"
      ? "px-5 py-1.5 text-[15px] h-[32px]" // Large action buttons
      : "px-3 py-[3px] text-[13px] h-[22px]"; // Standard dialog buttons

  const variants = {
    primary: `
      bg-[#007AFF] text-white border-[#0062CC] 
      hover:bg-[#0071E3] active:bg-[#005BB5]
      shadow-[0_1px_1px_rgba(0,0,0,0.1)]
      bg-linear-to-b from-white/10 to-transparent
    `,
    secondary: `
      bg-white dark:bg-[#606060] text-black dark:text-white 
      border-[#D1D1D6] dark:border-[#4D4D4D]
      hover:bg-[#F6F6F6] dark:hover:bg-[#6A6A6A]
      active:bg-[#ECECEC] dark:active:bg-[#555555]
      shadow-[0_1px_1px_rgba(0,0,0,0.05)]
    `,
    destructive: `
      bg-white text-red-600 border-[#D1D1D6]
      hover:bg-[#F6F6F6] active:bg-[#ECECEC]
    `,
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${className} disabled:opacity-50 disabled:grayscale`}
      {...props}
    >
      {children}
    </button>
  );
};
