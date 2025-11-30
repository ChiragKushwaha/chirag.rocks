import React from "react";
import { MacOSTypography } from "./design-system/MacOSTypography";
import { useDevice } from "./design-system/DeviceContext";

interface MacOSNavigationBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  translucent?: boolean;
}

export const MacOSNavigationBar: React.FC<MacOSNavigationBarProps> = ({
  title,
  leading,
  trailing,
  translucent = true,
  className = "",
  ...props
}) => {
  const { isMobile } = useDevice();

  const baseStyles = isMobile
    ? "h-[98px] w-full flex items-end pb-3 px-4 border-b transition-colors duration-200" // Mobile: Taller for large title
    : "h-[52px] w-full flex items-center px-4 border-b transition-colors duration-200"; // Desktop: Standard

  const bgStyles = translucent
    ? "bg-[var(--background)]/80 backdrop-blur-md border-[var(--separator)]"
    : "bg-[var(--background)] border-[var(--separator)]";

  return (
    <div className={`${baseStyles} ${bgStyles} ${className}`} {...props}>
      <div className="flex-1 flex items-center justify-start min-w-0">
        {leading}
      </div>

      <div className="flex-none px-4 text-center">
        {title && (
          <MacOSTypography
            variant={isMobile ? "largeTitle" : "headline"}
            className="truncate"
          >
            {title}
          </MacOSTypography>
        )}
      </div>

      <div className="flex-1 flex items-center justify-end min-w-0">
        {trailing}
      </div>
    </div>
  );
};
