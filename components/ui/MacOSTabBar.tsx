import React from "react";
import { useDevice } from "./design-system/DeviceContext";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface MacOSTabBarProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
}

export const MacOSTabBar: React.FC<MacOSTabBarProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  className = "",
  ...props
}) => {
  const { isMobile } = useDevice();

  // Mobile: Fixed at bottom, taller (49px is standard but often safe area adds more)
  // Desktop: Often used as segmented control or top bar. Here we assume bottom tab bar.

  const containerStyles = isMobile
    ? "fixed bottom-0 left-0 right-0 pb-safe h-[83px] items-start pt-2" // Mobile: Fixed bottom with safe area padding
    : "h-[49px] items-center"; // Desktop: Standard height

  return (
    <div
      className={`flex bg-[var(--background)]/90 backdrop-blur-lg border-t border-[var(--separator)] px-2 z-50 ${containerStyles} ${className}`}
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center h-full space-y-1 rounded-md transition-colors duration-200
              ${
                isActive
                  ? "text-[var(--system-blue)]"
                  : "text-[var(--secondary-label)] hover:bg-[var(--secondary-fill)]"
              }
            `}
          >
            {tab.icon && <span className="text-xl mb-0.5">{tab.icon}</span>}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
