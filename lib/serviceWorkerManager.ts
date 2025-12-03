// Service Worker Registration and Management
// This file handles SW registration, updates, and provides utilities for cache management

export class ServiceWorkerManager {
  private static registration: ServiceWorkerRegistration | null = null;

  /**
   * Register the service worker
   */
  static async register(): Promise<boolean> {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      console.log("Service Workers are not supported");
      return false;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        "Development mode detected: Service Worker enabled for testing"
      );
      // return false; // Commented out to enable in dev
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      this.registration = registration;

      console.log(
        "Service Worker registered successfully:",
        registration.scope
      );

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("New service worker available, reload to update");
              // You could show a notification to the user here
              this.notifyUpdate();
            }
          });
        }
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("Service Worker controller changed, reloading...");
        window.location.reload();
      });

      return true;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return false;
    }
  }

  /**
   * Unregister the service worker
   */
  static async unregister(): Promise<boolean> {
    if (!("serviceWorker" in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log("Service Worker unregistered");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Service Worker unregistration failed:", error);
      return false;
    }
  }

  /**
   * Clear all caches
   */
  static async clearAllCaches(): Promise<boolean> {
    if (!this.registration) {
      console.warn("No service worker registered");
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };

      this.registration!.active?.postMessage({ type: "CLEAR_CACHE" }, [
        messageChannel.port2,
      ]);
    });
  }

  /**
   * Cache a file to OPFS via service worker
   */
  static async cacheFile(
    path: string,
    data: Blob | ArrayBuffer
  ): Promise<boolean> {
    if (!this.registration) {
      console.warn("No service worker registered");
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };

      this.registration!.active?.postMessage(
        {
          type: "CACHE_FILE",
          path,
          data,
        },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Skip waiting and activate new service worker immediately
   */
  static async skipWaiting(): Promise<void> {
    if (!this.registration) {
      return;
    }

    this.registration.waiting?.postMessage({ type: "SKIP_WAITING" });
  }

  /**
   * Check if service worker is active
   */
  static isActive(): boolean {
    return !!navigator.serviceWorker?.controller;
  }

  /**
   * Notify user about service worker update
   */
  private static notifyUpdate(): void {
    // You can customize this to show a toast/notification in your UI
    const event = new CustomEvent("sw-update-available", {
      detail: {
        message: "A new version is available. Refresh to update.",
        action: () => this.skipWaiting(),
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * Get service worker status
   */
  static async getStatus(): Promise<{
    registered: boolean;
    active: boolean;
    waiting: boolean;
    scope?: string;
  }> {
    if (!("serviceWorker" in navigator)) {
      return { registered: false, active: false, waiting: false };
    }

    const registration = await navigator.serviceWorker.getRegistration();

    return {
      registered: !!registration,
      active: !!registration?.active,
      waiting: !!registration?.waiting,
      scope: registration?.scope,
    };
  }
}

// Auto-register on import (only in browser)
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Development mode detected: Service Worker disabled");
      ServiceWorkerManager.unregister();
    } else {
      ServiceWorkerManager.register();
    }
  });

  // Clear cache on page reload (Cmd+R or F5)
  window.addEventListener("beforeunload", () => {
    // Check if user is doing a hard reload
    if (performance.navigation.type === 1) {
      // This is a reload
      ServiceWorkerManager.clearAllCaches();
    }
  });
}

// Export for use in components
export default ServiceWorkerManager;
