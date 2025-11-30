import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SystemState {
  isBooting: boolean;
  isSetupComplete: boolean; // New: Tracks if onboarding is done
  theme: "light" | "dark"; // New: Tracks appearance
  wallpaper: string;
  activeApp: string;
  selectedFile: string | null;

  setBooting: (status: boolean) => void;
  setSetupComplete: (status: boolean) => void;
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
      wallpaper: "/wallpapers/sonoma.jpg",
      activeApp: "Finder",
      selectedFile: null,

      setBooting: (status) => set({ isBooting: status }),
      setSetupComplete: (status) => set({ isSetupComplete: status }),
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
      }),
    }
  )
);
