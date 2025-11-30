import React from "react";
import { MacOSTypography } from "./design-system/MacOSTypography";

interface MacOSListItem {
  id: string;
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
}

interface MacOSListProps {
  items: MacOSListItem[];
  inset?: boolean;
  className?: string;
}

export const MacOSList: React.FC<MacOSListProps> = ({
  items,
  inset = false,
  className = "",
}) => {
  return (
    <div className={`bg-[var(--ios-grouped-background)] ${className}`}>
      <div
        className={`${
          inset ? "mx-4 rounded-[10px] overflow-hidden" : ""
        } bg-[var(--secondary-background)]`}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={item.onClick}
            className={`
              flex items-center min-h-[44px] px-4 py-2 active:bg-[var(--secondary-fill)] transition-colors cursor-default
              ${
                index !== items.length - 1
                  ? "border-b border-[var(--separator)] ml-4 pl-0"
                  : ""
              }
            `}
          >
            {item.leading && (
              <div className="mr-3 text-[var(--system-blue)]">
                {item.leading}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <MacOSTypography variant="body" className="truncate">
                {item.title}
              </MacOSTypography>
              {item.subtitle && (
                <MacOSTypography
                  variant="caption1"
                  className="text-[var(--secondary-label)] truncate"
                >
                  {item.subtitle}
                </MacOSTypography>
              )}
            </div>

            {item.trailing && (
              <div className="ml-2 text-[var(--secondary-label)]">
                {item.trailing}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
