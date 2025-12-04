import { create } from "zustand";

export interface MenuItem {
  type?: "default" | "separator" | "tags";
  tags?: string[]; // For color tags
  label?: string | React.ReactNode;
  action?: () => void;
  shortcut?: string | React.ReactNode;
  separator?: boolean; // Deprecated, use type: 'separator'
  disabled?: boolean;
  danger?: boolean;
  submenu?: MenuItem[];
  icon?: string | React.ReactNode;
  stayOpenOnAction?: boolean;
}

interface MenuState {
  // Context Menu State
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    items: MenuItem[];
  };

  // Top Bar State
  activeMenuId: string | null; // 'apple', 'file', 'edit' etc.

  // Actions
  openContextMenu: (x: number, y: number, items: MenuItem[]) => void;
  closeContextMenu: () => void;
  setActiveMenu: (id: string | null) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  contextMenu: { isOpen: false, x: 0, y: 0, items: [] },
  activeMenuId: null,

  openContextMenu: (x, y, items) =>
    set({
      contextMenu: { isOpen: true, x, y, items },
      activeMenuId: null, // Close top menu if opening context
    }),

  closeContextMenu: () =>
    set({
      contextMenu: { isOpen: false, x: 0, y: 0, items: [] },
    }),

  setActiveMenu: (id) => set({ activeMenuId: id }),
}));
