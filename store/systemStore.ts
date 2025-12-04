import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WallpaperManager } from "../lib/WallpaperManager";

interface SystemState {
  isBooting: boolean;
  isSetupComplete: boolean;
  theme: "light" | "dark" | "auto";
  wallpaperName: string; // Base name like "Monterey" or "WhiteSur"
  activeApp: string;
  selectedFile: string | null;

  language: string;
  setLanguage: (lang: string) => void;

  user: {
    name: string;
    email: string;
    phone: string;
    age: string;
    password: string;
  };

  isLocked: boolean;
  lastActivityTime: number;
  credentialId: string | null;
  setLocked: (status: boolean) => void;
  setLastActivityTime: (time: number) => void;
  setCredentialId: (id: string | null) => void;
  resetIdleTimer: () => void;

  setBooting: (status: boolean) => void;
  setSetupComplete: (status: boolean) => void;
  updateUser: (details: Partial<SystemState["user"]>) => void;
  setTheme: (theme: "light" | "dark" | "auto") => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  toggleTheme: () => void;
  setWallpaperName: (name: string) => void;

  setActiveApp: (appName: string) => void;
  setSelectedFile: (filename: string | null) => void;

  isSpotlightOpen: boolean;
  toggleSpotlight: (force?: boolean) => void;

  trashCount: number;
  setTrashCount: (count: number) => void;

  hasCreatedWelcomeFile: boolean;
  setHasCreatedWelcomeFile: (status: boolean) => void;

  hasSeededResume: boolean;
  setHasSeededResume: (status: boolean) => void;

  iconPositions: Record<string, { x: number; y: number }>;
  setIconPosition: (name: string, x: number, y: number) => void;

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

  isNotificationCenterOpen: boolean;
  toggleNotificationCenter: () => void;

  idleTimeoutSeconds: number;
  setIdleTimeoutSeconds: (seconds: number) => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      isBooting: true,
      isSetupComplete: false,
      theme: "auto",
      language: "English",
      wallpaperName: "WhiteSur",
      activeApp: "Finder",
      selectedFile: null,

      user: {
        name: "",
        email: "",
        phone: "",
        age: "",
        password: "",
      },

      isLocked: false,
      lastActivityTime: Date.now(),
      credentialId: null,

      setBooting: (status) => set({ isBooting: status }),
      setSetupComplete: (status) => set({ isSetupComplete: status }),
      setLanguage: (lang) => set({ language: lang }),
      updateUser: (details) =>
        set((state) => ({ user: { ...state.user, ...details } })),
      setLocked: (status) => set({ isLocked: status }),
      setLastActivityTime: (time) => set({ lastActivityTime: time }),
      setCredentialId: (id) => set({ credentialId: id }),
      resetIdleTimer: () => set({ lastActivityTime: Date.now() }),
      setTheme: (theme) => {
        set(() => {
          let isDark = false;
          if (theme === "auto") {
            if (typeof window !== "undefined") {
              isDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
              ).matches;
            }
          } else {
            isDark = theme === "dark";
          }
          return { theme, isDark };
        });
      },
      isDark: false,
      setIsDark: (isDark) => set({ isDark }),

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === "dark" ? "light" : "dark";
          return { theme: newTheme, isDark: newTheme === "dark" };
        });
      },
      setWallpaperName: (name) => set({ wallpaperName: name }),

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

      hasSeededResume: false,
      setHasSeededResume: (status) => set({ hasSeededResume: status }),

      iconPositions: {},
      setIconPosition: (name, x, y) =>
        set((state) => ({
          iconPositions: {
            ...state.iconPositions,
            [name]: { x, y },
          },
        })),

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

      isNotificationCenterOpen: false,
      toggleNotificationCenter: () =>
        set((state) => ({
          isNotificationCenterOpen: !state.isNotificationCenterOpen,
        })),

      idleTimeoutSeconds: 5 * 60, // 30 seconds default
      setIdleTimeoutSeconds: (seconds) => set({ idleTimeoutSeconds: seconds }),

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "macOS-system-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        isSetupComplete: state.isSetupComplete,
        theme: state.theme,
        language: state.language,
        user: state.user,
        wallpaperName: state.wallpaperName,
        hasCreatedWelcomeFile: state.hasCreatedWelcomeFile,
        hasSeededResume: state.hasSeededResume,
        iconPositions: state.iconPositions,
        brightness: state.brightness,
        volume: state.volume,
        wifiEnabled: state.wifiEnabled,
        bluetoothEnabled: state.bluetoothEnabled,
        credentialId: state.credentialId,
        idleTimeoutSeconds: state.idleTimeoutSeconds,
        isLocked: state.isLocked, // Persist lock state
        isDark: state.isDark, // Persist effective theme state
      }),
    }
  )
);

// Helper function to get active wallpaper based on theme
export const getActiveWallpaper = () => {
  const state = useSystemStore.getState();
  // If theme is auto, use isDark to determine variant
  const effectiveTheme =
    state.theme === "auto" ? (state.isDark ? "dark" : "light") : state.theme;
  return WallpaperManager.getWallpaperPath(state.wallpaperName, effectiveTheme);
};
