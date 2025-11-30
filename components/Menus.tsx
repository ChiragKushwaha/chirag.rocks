import React, { useEffect, useRef } from "react";
import { useMenuStore, MenuItem } from "../store/menuStore";

// --- Shared Menu Item Renderer ---
const MenuList: React.FC<{ items: MenuItem[]; onClose: () => void }> = ({
  items,
  onClose,
}) => {
  return (
    <div className="min-w-[160px] py-1">
      {items.map((item, idx) =>
        item.separator ? (
          <div key={idx} className="h-[1px] bg-black/10 my-1 mx-2" />
        ) : (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              if (!item.disabled && item.action) {
                item.action();
                onClose();
              }
            }}
            disabled={item.disabled}
            className={`
              w-full text-left px-4 py-1 text-[13px] flex justify-between items-center
              ${
                item.disabled
                  ? "text-gray-400"
                  : "hover:bg-blue-600 hover:text-white text-gray-800"
              }
              ${item.danger ? "text-red-500" : ""}
            `}
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="opacity-50 text-[11px] ml-4 font-sans">
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

  if (!contextMenu.isOpen) return null;

  return (
    <div
      ref={ref}
      style={{ top: contextMenu.y, left: contextMenu.x }}
      className="fixed z-[9999] bg-white/90 backdrop-blur-xl border border-black/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left"
    >
      <MenuList items={contextMenu.items} onClose={closeContextMenu} />
    </div>
  );
};

// --- Top Bar Dropdown ---
export const TopDropdown: React.FC<{
  items: MenuItem[];
  isOpen: boolean;
  xOffset: number;
  onClose: () => void;
}> = ({ items, isOpen, xOffset, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed top-8 z-[9000] bg-white/90 backdrop-blur-xl border border-black/10 rounded-b-lg shadow-lg overflow-hidden"
      style={{ left: xOffset }}
    >
      <MenuList items={items} onClose={onClose} />
    </div>
  );
};
