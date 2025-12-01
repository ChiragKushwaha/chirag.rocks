import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMenuStore, MenuItem } from "../store/menuStore";

// --- Shared Menu Item Renderer ---
const MenuList: React.FC<{ items: MenuItem[]; onClose: () => void }> = ({
  items,
  onClose,
}) => {
  return (
    <div className="flex flex-col px-1">
      {items.map((item, idx) =>
        item.separator ? (
          <div
            key={idx}
            className="h-px bg-black/10 dark:bg-white/20 my-1 mx-2"
          />
        ) : (
          <button
            key={idx}
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
              w-full text-left px-3 py-1 text-[13px] flex justify-between items-center rounded-md transition-colors
              ${
                item.disabled
                  ? "text-gray-400 dark:text-gray-500 cursor-default"
                  : "hover:bg-blue-500 hover:text-white text-gray-900 dark:text-white active:bg-blue-600"
              }
              ${item.danger && !item.disabled ? "text-red-500" : ""}
            `}
          >
            <span className="flex items-center gap-2">
              {item.icon && (
                <span className="w-4 h-4 flex items-center justify-center">
                  {item.icon}
                </span>
              )}
              {item.label}
            </span>
            {item.shortcut && (
              <span
                className={`text-[11px] ml-4 font-sans ${
                  item.disabled ? "opacity-50" : "opacity-60"
                }`}
              >
                {item.shortcut}
              </span>
            )}
          </button>
        )
      )}
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
      className="fixed z-[9999] min-w-[220px] bg-white/90 dark:bg-[#1c1c1c]/90 backdrop-blur-3xl border border-black/10 dark:border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left py-1.5"
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
      className="fixed top-[30px] min-w-[220px] bg-white/90 dark:bg-[#1c1c1c]/90 backdrop-blur-3xl border border-black/10 dark:border-white/20 rounded-xl shadow-2xl overflow-hidden py-1.5"
      style={{ left: xOffset, zIndex: 9999 }}
    >
      <MenuList items={items} onClose={onClose} />
    </div>,
    document.body
  );
};
