import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SystemState {
  isBooting: boolean;
  isSetupComplete: boolean; // New: Tracks if onboarding is done
  theme: "light" | "dark"; // New: Tracks appearance
  wallpaper: string;
  activeApp: string;
  selectedFile: string | null;

  user: {
    name: string;
    email: string;
    phone: string;
    age: string;
  };

  setBooting: (status: boolean) => void;
  setSetupComplete: (status: boolean) => void;
  updateUser: (details: Partial<SystemState["user"]>) => void;
  setTheme: (theme: "light" | "dark") => void;
  setActiveApp: (appName: string) => void;
  setSelectedFile: (filename: string | null) => void;

  isSpotlightOpen: boolean;
  toggleSpotlight: (force?: boolean) => void;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      isBooting: true,
      isSetupComplete: false,
      theme: "light",
      wallpaper: "/System/Library/Desktop Pictures/Sonoma.heic", // Default to Sonoma
      activeApp: "Finder",
      selectedFile: null,

      user: {
        name: "",
        email: "",
        phone: "",
        age: "",
      },

      setBooting: (status) => set({ isBooting: status }),
      setSetupComplete: (status) => set({ isSetupComplete: status }),
      updateUser: (details) =>
        set((state) => ({ user: { ...state.user, ...details } })),
      setTheme: (theme) => {
        // Apply tailwind dark mode class immediately
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        set({ theme });
      },
      setActiveApp: (appName) => set({ activeApp: appName }),
      setSelectedFile: (filename) => set({ selectedFile: filename }),

      isSpotlightOpen: false,
      toggleSpotlight: (force) =>
        set((state) => ({
          isSpotlightOpen: force !== undefined ? force : !state.isSpotlightOpen,
        })),
    }),
    {
      name: "macOS-system-storage", // unique name for localStorage
      partialize: (state) => ({
        // Only persist these fields
        isSetupComplete: state.isSetupComplete,
        theme: state.theme,
        user: state.user,
      }),
    }
  )
);
