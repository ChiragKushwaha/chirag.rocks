"use client";
import React, { useEffect } from "react";
import { Desktop } from "../components/Desktop";
import { SetupAssistant } from "../apps/SetupAssistant";
import { fs } from "../lib/FileSystem";
import { MacInstaller } from "../lib/Installer";
import { useSystemStore } from "../store/systemStore";
import { Analytics } from "@vercel/analytics/next";

function App() {
  const { isSetupComplete, theme, user } = useSystemStore();

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
      }
    };
    initOS();

    // Apply Theme on Boot
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // 2. Render Strategy
  return (
    <div className="w-full h-full overflow-hidden">
      {isSetupComplete ? <Desktop /> : <SetupAssistant />}
      <Analytics />
    </div>
  );
}

export default App;
