import { useCallback } from "react";
import { useSystemStore } from "../store/systemStore";

export const useAuth = () => {
  const { isLocked, setLocked, _hasHydrated } = useSystemStore();

  const unlock = useCallback(
    (password: string, userPassword: string): boolean => {
      if (password === userPassword) {
        setLocked(false);
        return true;
      }
      return false;
    },
    [setLocked]
  );

  const lock = useCallback(() => {
    setLocked(true);
  }, [setLocked]);

  return {
    isLocked,
    isInitialized: _hasHydrated,
    unlock,
    lock,
  };
};
