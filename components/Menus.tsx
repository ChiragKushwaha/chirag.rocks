import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMenuStore, MenuItem } from "../store/menuStore";

// --- Shared Menu Item Renderer ---
const MenuList: React.FC<{ items: MenuItem[]; onClose: () => void }> = ({
  items,
  onClose,
}) => {
  const [activeSubmenuIndex, setActiveSubmenuIndex] = React.useState<
    number | null
  >(null);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  return (
    <div className="flex flex-col px-1 py-1 relative">
      {items.map((item, idx) => {
        if (item.separator || item.type === "separator") {
          return <div key={idx} className="h-[1px] bg-white/10 my-1 mx-2" />;
        }

        if (item.type === "tags") {
          return (
            <div
              key={idx}
              className="px-3 py-1 flex justify-between items-center group"
              onMouseEnter={() => {
                if (hoverTimeoutRef.current)
                  clearTimeout(hoverTimeoutRef.current);
                setActiveSubmenuIndex(null);
              }}
            >
              <div className="flex gap-2 justify-center w-full">
                {[
                  "#ff453a",
                  "#ff9f0a",
                  "#ffd60a",
                  "#32d74b",
                  "#64d2ff",
                  "#bf5af2",
                  "#8e8e93",
                ].map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full border border-white/10 hover:scale-125 transition-transform cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                  />
                ))}
              </div>
            </div>
          );
        }

        const isActive = activeSubmenuIndex === idx;

        return (
          <div
            key={idx}
            className="relative"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current)
                clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = setTimeout(() => {
                setActiveSubmenuIndex(idx);
              }, 150); // Small delay to prevent flickering
            }}
            onMouseLeave={() => {
              if (hoverTimeoutRef.current)
                clearTimeout(hoverTimeoutRef.current);
              // Don't immediately close on leave, let the submenu handle its own enter
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!item.disabled && item.action) {
                  item.action();
                  if (!item.stayOpenOnAction) {
                    onClose();
                  }
                }
              }}
              disabled={item.disabled}
              className={`
                w-full text-left px-3 py-0.5 text-[13px] flex justify-between items-center rounded-[4px] transition-colors font-medium
                ${
                  item.disabled
                    ? "text-gray-400 dark:text-white/30 cursor-default"
                    : isActive
                    ? "bg-[#007AFF] text-white"
                    : "text-black dark:text-white hover:bg-[#007AFF] hover:text-white active:bg-[#0062cc]"
                }
                ${
                  item.danger && !item.disabled
                    ? "text-red-500 dark:text-red-400"
                    : ""
                }
              `}
            >
              <span className="flex items-center gap-2">
                {item.icon && (
                  <span className="w-4 h-4 flex items-center justify-center opacity-80">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </span>
              <span className="flex items-center">
                {item.shortcut && (
                  <span
                    className={`text-[11px] ml-4 font-sans tracking-wide ${
                      item.disabled ? "opacity-30" : "opacity-50"
                    }`}
                  >
                    {item.shortcut}
                  </span>
                )}
                {item.submenu && (
                  <span className="ml-2 opacity-50">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                )}
              </span>
            </button>

            {/* Submenu */}
            {item.submenu && isActive && (
              <div
                className="absolute left-full top-0 ml-[-4px] z-50 min-w-[200px] bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-75 origin-top-left"
                style={{ marginTop: -4 }}
              >
                <MenuList items={item.submenu} onClose={onClose} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// --- Context Menu (Right Click) ---
export const ContextMenu: React.FC = () => {
  const { contextMenu, closeContextMenu } = useMenuStore();
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };
    if (contextMenu.isOpen) window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [contextMenu.isOpen, closeContextMenu]);

  if (!mounted || !contextMenu.isOpen) return null;

  return createPortal(
    <div
      ref={ref}
      style={{ top: contextMenu.y, left: contextMenu.x }}
      className="fixed z-[9999] min-w-[240px] bg-white/90 dark:bg-[#1e1e1e]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-75 origin-top-left"
    >
      <MenuList items={contextMenu.items} onClose={closeContextMenu} />
    </div>,
    document.body
  );
};

// --- Top Bar Dropdown ---
export const TopDropdown: React.FC<{
  items: MenuItem[];
  isOpen: boolean;
  xOffset: number;
  onClose: () => void;
}> = ({ items, isOpen, xOffset, onClose }) => {
  const [mounted, setMounted] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't close if clicking the menu button itself (handled by parent)
      // But since this is a portal, checking if click is outside THIS ref is usually enough.
      // However, the parent button click toggles it. If we close it here, the parent toggle might re-open it or get confused.
      // Usually, we want to close if click is outside of THIS dropdown AND outside of the button.
      // But we don't have ref to the button here.
      // A common pattern is to just close if outside. If the user clicked the button, the button's onClick will fire.
      // If the button's onClick toggles, and we close it here, we might have a race condition or double toggle.
      // Let's rely on the fact that if we click outside, we close.
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Small delay to avoid immediate close if the click that opened it bubbles up?
      // No, mousedown is usually fine.
      // We use setTimeout to attach the listener to avoid the current click event triggering it immediately if it bubbled?
      // React events bubble, but window.addEventListener is native.
      // If we attach on mount (when isOpen becomes true), and the click that opened it is still propagating...
      // But this is a Portal, so propagation might be tricky.
      // Let's attach immediately.
      window.addEventListener("mousedown", handleClick);
    }
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={ref}
      className="fixed top-[30px] min-w-[220px] bg-white/90 dark:bg-[#1c1c1c]/90 backdrop-blur-3xl border border-black/10 dark:border-white/20 rounded-xl shadow-2xl py-1.5"
      style={{ left: xOffset, zIndex: 9999 }}
    >
      <MenuList items={items} onClose={onClose} />
    </div>,
    document.body
  );
};
