import React, { useEffect, useState, useRef } from "react";

interface MenuItem {
  id: string;
  label?: string;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  action?: () => void;
}

interface MacOSContextMenuProps {
  items: MenuItem[];
  children: React.ReactNode;
}

export const MacOSContextMenu: React.FC<MacOSContextMenuProps> = ({
  items,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    const handleScroll = () => {
      if (visible) setVisible(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [visible]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setVisible(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onContextMenu={handleContextMenu} className="inline-block">
      {children}
      {visible && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[220px] py-1.5 bg-white/70 dark:bg-[#1e1e1e]/70 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
          style={{ top: position.y, left: position.x }}
        >
          {items.map((item, index) => {
            if (item.separator) {
              return (
                <div
                  key={index}
                  className="my-1.5 h-[1px] bg-[var(--separator)]"
                />
              );
            }
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => {
                  item.action?.();
                  setVisible(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1 text-[13px] text-left transition-colors duration-100
                  ${
                    item.disabled
                      ? "text-[var(--tertiary-label)] cursor-default"
                      : "text-[var(--label)] hover:bg-[var(--system-blue)] hover:text-white"
                  }
                `}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span
                    className={`ml-4 ${
                      item.disabled ? "opacity-50" : "opacity-60"
                    }`}
                  >
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
