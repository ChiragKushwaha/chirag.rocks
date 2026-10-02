import React from "react";

interface MacToggleProps {
  checked: boolean;
  onChange?: (v: boolean) => void;
  onClick?: () => void;
  disabled?: boolean;
}

export const MacToggle: React.FC<MacToggleProps> = ({
  checked,
  onChange,
  onClick,
  disabled = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (onClick) onClick();
    else if (onChange) onChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative shrink-0 rounded-full transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      style={{
        width: 38,
        height: 22,
        background: checked ? "#34C759" : "rgba(120,120,128,0.32)",
      }}
    >
      <span
        className="absolute rounded-full bg-white transition-all duration-200 ease-out"
        style={{
          width: 18,
          height: 18,
          top: 2,
          left: checked ? 18 : 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.15)",
        }}
      />
    </button>
  );
};
