import { useEffect, useState } from "react";
import ServiceWorkerManager from "../lib/serviceWorkerManager";

interface ServiceWorkerStatus {
  registered: boolean;
  active: boolean;
  waiting: boolean;
  updateAvailable: boolean;
}

export function useServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    registered: false,
    active: false,
    waiting: false,
    updateAvailable: false,
  });

  useEffect(() => {
    // Check initial status
    ServiceWorkerManager.getStatus().then((swStatus) => {
      setStatus({
        ...swStatus,
        updateAvailable: false,
      });
    });

    // Listen for update available
    const handleUpdate = () => {
      setStatus((prev) => ({ ...prev, updateAvailable: true }));
    };

    window.addEventListener("sw-update-available", handleUpdate);

    return () => {
      window.removeEventListener("sw-update-available", handleUpdate);
    };
  }, []);

  const clearCache = async () => {
    const success = await ServiceWorkerManager.clearAllCaches();
    if (success) {
      console.log("Cache cleared successfully");
    }
    return success;
  };

  const update = async () => {
    await ServiceWorkerManager.skipWaiting();
  };

  return {
    ...status,
    clearCache,
    update,
    isReady: status.registered && status.active,
  };
}
