import React from "react";
import { MacOSTypography } from "./design-system/MacOSTypography";
import { useDevice } from "./design-system/DeviceContext";

interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface MacOSSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: SidebarSection[];
  activeItemId?: string;
  onItemClick: (id: string) => void;
  translucent?: boolean;
}

export const MacOSSidebar: React.FC<MacOSSidebarProps> = ({
  sections,
  activeItemId,
  onItemClick,
  translucent = true,
  className = "",
  ...props
}) => {
  const { isMobile } = useDevice();

  // Mobile/Tablet: Sidebar acts as a slide-over or is hidden (handled by parent usually, but here we style it)
  // For this implementation, we'll assume it's a permanent sidebar on desktop, and a drawer on mobile.
  // However, to keep it simple for now, we'll just adjust width/styles.

  const widthClass = isMobile ? "w-full" : "w-[260px]";
  const borderClass = isMobile ? "" : "border-r";

  const bgStyles = translucent
    ? `bg-[var(--secondary-background)]/90 backdrop-blur-xl ${borderClass} border-[var(--separator)]`
    : `bg-[var(--secondary-background)] ${borderClass} border-[var(--separator)]`;

  return (
    <div
      className={`${widthClass} h-full flex flex-col py-4 overflow-y-auto ${bgStyles} ${className}`}
      {...props}
    >
      {sections.map((section, index) => (
        <div key={index} className="mb-6 px-3">
          {section.title && (
            <MacOSTypography
              variant="subhead"
              className="px-2 mb-2 text-[var(--secondary-label)] font-semibold uppercase tracking-wider text-[11px]"
            >
              {section.title}
            </MacOSTypography>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = item.id === activeItemId;
              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick(item.id)}
                  className={`w-full flex items-center px-2 py-1.5 rounded-[6px] text-[13px] transition-colors duration-150
                    ${
                      isActive
                        ? "bg-[var(--system-blue)] text-white font-medium"
                        : "text-[var(--label)] hover:bg-[var(--secondary-fill)] active:bg-[var(--tertiary-fill)]"
                    }
                  `}
                >
                  {item.icon && (
                    <span
                      className={`mr-2.5 ${
                        isActive ? "text-white" : "text-[var(--system-blue)]"
                      }`}
                    >
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
