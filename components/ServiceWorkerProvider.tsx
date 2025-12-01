"use client";

import { useEffect } from "react";
import ServiceWorkerManager from "../lib/serviceWorkerManager";

export function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register service worker on mount
    ServiceWorkerManager.register();

    // Listen for page visibility changes to clear cache on focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Optional: Check for updates when page becomes visible
        ServiceWorkerManager.getStatus().then((status) => {
          if (status.waiting) {
            console.log("Service worker update available");
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <>{children}</>;
}
