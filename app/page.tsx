"use client";
import { useEffect } from "react";
import { SetupAssistant } from "../apps/SetupAssistant";
import { Desktop } from "../components/Desktop";
import { LockScreen } from "../components/LockScreen";
import { PermissionProvider } from "../context/PermissionContext";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { fs } from "../lib/FileSystem";
import { MacInstaller } from "../lib/Installer";
import { useSystemStore } from "../store/systemStore";
// Extend Window interface to include lockScreen function
declare global {
  interface Window {
    lockScreen?: () => void;
  }
}

function App() {
  const { isSetupComplete, user, lastActivityTime, resetIdleTimer } =
    useSystemStore();

  const { isLocked, isInitialized, lock } = useAuth();

  // Initialize Theme
  useTheme();

  // Auto Fullscreen on first interaction (Production only)
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const handleInteraction = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => {
          // Ignore error (e.g. user denied)
          console.log("Fullscreen request failed:", e);
        });
      }
      // Remove listeners after first attempt
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // 1. Initialize OS Layer
  useEffect(() => {
    const initOS = async () => {
      await fs.init();
      // Check for kernel
      const isInstalled = await fs.exists("/System");
      if (!isInstalled) {
        const installer = new MacInstaller();
        // Use stored name or default to Guest if empty (though setup should handle this)
        await installer.install(user.name || "Guest");
      } else {
        // Migration Check: If we have a user name but their folder doesn't exist,
        // and Guest exists, assume we need to migrate or rename Guest -> User
        const userName = user.name || "Guest";
        if (userName !== "Guest") {
          const userHome = `/Users/${userName}`;
          const guestHome = `/Users/Guest`;

          const hasUserHome = await fs.exists(userHome);
          const hasGuestHome = await fs.exists(guestHome);

          if (!hasUserHome && hasGuestHome) {
            console.log(`[Boot] Migrating Guest -> ${userName}...`);
            try {
              await fs.rename("/Users", "Guest", userName);
            } catch (e) {
              console.error("Migration failed:", e);
            }
          } else if (!hasUserHome) {
            // Create user home if it doesn't exist at all (and no Guest to migrate)
            await fs.mkdir(userHome);
            await fs.mkdir(`${userHome}/Desktop`);
            await fs.mkdir(`${userHome}/Documents`);
            await fs.mkdir(`${userHome}/Downloads`);
          }
        }

        // Ensure Welcome.txt exists (Only once)
        const currentUserName = user.name || "Guest";
        const { hasCreatedWelcomeFile, setHasCreatedWelcomeFile } =
          useSystemStore.getState();

        if (!hasCreatedWelcomeFile) {
          const welcomePath = `/Users/${currentUserName}/Desktop/Welcome.txt`;
          const hasWelcome = await fs.exists(welcomePath);

          if (!hasWelcome) {
            await fs.writeFile(
              `/Users/${currentUserName}/Desktop`,
              "Welcome.txt",
              `Hello ${currentUserName}! Welcome to your new Mac.`
            );
          }
          setHasCreatedWelcomeFile(true);
        }
      }
    };
    initOS();
  }, [user.name]);

  // Expose lock function globally for MenuBar and other components
  useEffect(() => {
    window.lockScreen = lock;
    return () => {
      delete window.lockScreen;
    };
  }, [lock]);

  // 2. Idle Detection - Lock after configured timeout (only if setup complete)
  useEffect(() => {
    if (!isSetupComplete) return; // Don't track activity during onboarding

    const { idleTimeoutSeconds } = useSystemStore.getState();
    const IDLE_TIMEOUT = idleTimeoutSeconds * 1000; // Convert to milliseconds

    const checkIdleStatus = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTime;

      if (
        timeSinceLastActivity >= IDLE_TIMEOUT &&
        !isLocked &&
        idleTimeoutSeconds > 0
      ) {
        lock(); // Use auth lock instead of setLocked
      }
    };

    // Check idle status every 5 seconds
    const interval = setInterval(checkIdleStatus, 5000);

    // Activity listeners
    const handleActivity = () => {
      if (!isLocked) {
        resetIdleTimer();
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [isSetupComplete, isLocked, lastActivityTime, resetIdleTimer, lock]);

  const hasHydrated = useSystemStore((state) => state._hasHydrated);

  // 3. Render Strategy
  if (!hasHydrated || !isInitialized) {
    return <div className="bg-black w-full h-full" />;
  }

  // Show lock screen if locked, otherwise show desktop or setup
  const shouldShowLockScreen = isLocked && isSetupComplete;

  return (
    <PermissionProvider>
      <div className="w-full h-full overflow-hidden">
        {shouldShowLockScreen ? (
          <LockScreen />
        ) : isSetupComplete ? (
          <Desktop />
        ) : (
          <SetupAssistant />
        )}
      </div>
    </PermissionProvider>
  );
}

export default App;
