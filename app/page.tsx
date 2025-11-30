"use client";
import React, { useEffect } from "react";
import { Desktop } from "../components/Desktop";
import { SetupAssistant } from "../apps/SetupAssistant";
import { fs } from "../lib/FileSystem";
import { MacInstaller } from "../lib/Installer";
import { useSystemStore } from "../store/systemStore";

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
    </div>
  );
}

export default App;
