import React from "react";

interface SettingsGroupProps {
  children: React.ReactNode;
  title?: string;
  footer?: string;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  children,
  title,
  footer,
}) => (
  <div className="mb-5">
    {title && (
      <h3 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 px-3 uppercase tracking-wider">
        {title}
      </h3>
    )}
    <div
      className="rounded-xl overflow-hidden border"
      style={{
        background: "rgba(255,255,255,0.92)",
        borderColor: "rgba(0,0,0,0.10)",
      }}
    >
      {children}
    </div>
    {/* Dark mode override via CSS class */}
    <style>{`
      .dark .settings-group-card {
        background: rgba(58,58,60,0.8) !important;
        border-color: rgba(255,255,255,0.08) !important;
      }
    `}</style>
    {footer && (
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 px-3">
        {footer}
      </p>
    )}
  </div>
);
