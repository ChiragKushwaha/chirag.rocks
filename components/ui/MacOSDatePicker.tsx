import React from "react";

interface MacOSDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

export const MacOSDatePicker: React.FC<MacOSDatePickerProps> = ({
  value = new Date(),
  className = "",
}) => {
  // Simplified visual representation for now
  const formattedDate = value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = value.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className={`inline-flex items-center gap-2 bg-[var(--control-background)] border border-[var(--control-border)] rounded-[6px] px-2 py-1 shadow-sm ${className}`}
    >
      <span className="text-[13px] text-[var(--label)] font-variant-numeric tabular-nums">
        {formattedDate}
      </span>
      <span className="w-px h-3 bg-[var(--separator)]" />
      <span className="text-[13px] text-[var(--label)] font-variant-numeric tabular-nums">
        {formattedTime}
      </span>
    </div>
  );
};
