import React from "react";

interface SettingsGroupProps {
  children: React.ReactNode;
  title?: string;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  children,
  title,
}) => (
  <div className="mb-6">
    {title && (
      <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">{title}</h3>
    )}
    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
      {children}
    </div>
  </div>
);
