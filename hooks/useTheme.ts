import { useEffect } from "react";
import { useSystemStore } from "../store/systemStore";

export const useTheme = () => {
  useEffect(() => {
    // 1. Sync Function
    const syncThemeToDOM = (isDark: boolean) => {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // 2. Initial Sync
    // We immediately sync the current store state to the DOM
    syncThemeToDOM(useSystemStore.getState().isDark);

    // 3. Re-evaluate Theme (e.g. on mount or system change)
    const recalcTheme = () => {
      const { theme, setIsDark } = useSystemStore.getState();

      if (theme === "auto") {
        const isSystemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        // Only update if different to avoid unnecessary state updates
        if (useSystemStore.getState().isDark !== isSystemDark) {
          setIsDark(isSystemDark);
        }
      }
    };

    // Run recalc on mount to ensure we match system if in auto mode
    recalcTheme();

    // 4. Listen for System Changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (useSystemStore.getState().theme === "auto") {
        // We can use e.matches directly
        const isSystemDark = e.matches;
        useSystemStore.getState().setIsDark(isSystemDark);
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);

    // 5. Subscribe to Store Changes
    const unsubscribe = useSystemStore.subscribe((state, prevState) => {
      // Sync DOM when isDark changes
      if (state.isDark !== prevState.isDark) {
        syncThemeToDOM(state.isDark);
      }

      // If theme changed to/from auto, we might need to recalc
      // (Though setTheme in store handles the atomic update, this is a safety net)
      if (state.theme !== prevState.theme) {
        if (state.theme === "auto") {
          recalcTheme();
        }
      }
    });

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
      unsubscribe();
    };
  }, []);
};
