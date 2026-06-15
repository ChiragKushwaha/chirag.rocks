import React from "react";

interface ViewHeaderProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  color?: string;
  right?: React.ReactNode;
}

/**
 * Standard Big Sur-style settings panel header:
 *  [Colored icon badge]  Title
 *                        Description
 */
export const ViewHeader: React.FC<ViewHeaderProps> = ({
  icon: Icon,
  title,
  description,
  color = "#007AFF",
  right,
}) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-4">
      <div
        className="w-14 h-14 rounded-[14px] flex items-center justify-center shadow-sm shrink-0"
        style={{ background: color }}
      >
        <Icon size={30} color="white" />
      </div>
      <div>
        <h2 className="text-[18px] font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-[12px] text-gray-500 mt-0.5 leading-snug max-w-sm">
            {description}
          </p>
        )}
      </div>
    </div>
    {right && <div>{right}</div>}
  </div>
);
