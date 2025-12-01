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
  isDark: boolean;
  toggleTheme: () => void;
  setWallpaper: (url: string) => void;

  setActiveApp: (appName: string) => void;
  setSelectedFile: (filename: string | null) => void;

  isSpotlightOpen: boolean;
  toggleSpotlight: (force?: boolean) => void;

  trashCount: number;
  setTrashCount: (count: number) => void;

  hasCreatedWelcomeFile: boolean;
  setHasCreatedWelcomeFile: (status: boolean) => void;

  wifiEnabled: boolean;
  toggleWifi: () => void;

  brightness: number;
  setBrightness: (value: number) => void;

  volume: number;
  setVolume: (value: number) => void;

  bluetoothEnabled: boolean;
  toggleBluetooth: () => void;

  airdropEnabled: boolean;
  toggleAirdrop: () => void;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      isBooting: true,
      isSetupComplete: false,
      theme: "light",
      // wallpaper: "https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-2560x1440-1455.jpg",
      wallpaper: "/System/Library/Desktop Pictures/macos-big-sur.jpg", // macOS Big Sur Abstract
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
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        set({ theme });
      },
      // Helper for SystemSettings
      // Note: isDark is a derived property, but Zustand doesn't support getters directly on the state object in this way easily without middleware or selectors.
      // Instead, we'll just rely on the theme property in components, or add a specific action to toggle.
      // For SystemSettings, we can just use `theme === 'dark'`.
      // However, to satisfy the interface we added:
      isDark: false, // Placeholder, will be updated by middleware or we just use theme

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === "dark" ? "light" : "dark";
          if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { theme: newTheme };
        });
      },
      setWallpaper: (url) => set({ wallpaper: url }),

      setActiveApp: (appName) => set({ activeApp: appName }),
      setSelectedFile: (filename) => set({ selectedFile: filename }),

      isSpotlightOpen: false,
      toggleSpotlight: (force) =>
        set((state) => ({
          isSpotlightOpen: force !== undefined ? force : !state.isSpotlightOpen,
        })),

      trashCount: 0,
      setTrashCount: (count) => set({ trashCount: count }),

      hasCreatedWelcomeFile: false,
      setHasCreatedWelcomeFile: (status) =>
        set({ hasCreatedWelcomeFile: status }),

      wifiEnabled: true,
      toggleWifi: () => set((state) => ({ wifiEnabled: !state.wifiEnabled })),

      brightness: 100,
      setBrightness: (value) => set({ brightness: value }),

      volume: 50,
      setVolume: (value) => set({ volume: value }),

      bluetoothEnabled: true,
      toggleBluetooth: () =>
        set((state) => ({ bluetoothEnabled: !state.bluetoothEnabled })),

      airdropEnabled: false,
      toggleAirdrop: () =>
        set((state) => ({ airdropEnabled: !state.airdropEnabled })),
    }),
    {
      name: "macOS-system-storage", // unique name for localStorage
      partialize: (state) => ({
        // Only persist these fields
        isSetupComplete: state.isSetupComplete,
        theme: state.theme,
        user: state.user,
        wallpaper: state.wallpaper, // Persist wallpaper
        hasCreatedWelcomeFile: state.hasCreatedWelcomeFile,
        brightness: state.brightness,
        volume: state.volume,
        wifiEnabled: state.wifiEnabled,
        bluetoothEnabled: state.bluetoothEnabled,
      }),
    }
  )
);
