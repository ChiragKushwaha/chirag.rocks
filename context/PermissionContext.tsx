"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { PermissionDialog } from "../components/PermissionDialog";

interface PermissionRequest {
  id: string;
  appName: string;
  icon: React.ReactNode | string;
  title: string;
  description: string;
  onAllow: () => void;
  onDeny: () => void;
  isBlocked?: boolean;
}

interface PermissionContextType {
  requestPermission: (
    appName: string,
    icon: React.ReactNode | string,
    title: string,
    description: string,
    permissionName?: string
  ) => Promise<boolean>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queue, setQueue] = useState<PermissionRequest[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const pendingPromises = React.useRef<Map<string, Promise<boolean>>>(
    new Map()
  );
  const blockedDialogRef = React.useRef(false);

  const requestPermission = useCallback(
    async (
      appName: string,
      icon: React.ReactNode | string,
      title: string,
      description: string,
      permissionName?: string
    ): Promise<boolean> => {
      const requestKey = `${appName}_${title}`;

      // 0. Check for existing pending request to prevent stacking/spamming
      if (pendingPromises.current.has(requestKey)) {
        return pendingPromises.current.get(requestKey)!;
      }

      const executionPromise = (async () => {
        let isBlocked = false;
        let browserStatus: PermissionState | undefined;

        // 1. Check Browser Permission (if permissionName provided)
        if (
          permissionName &&
          typeof navigator !== "undefined" &&
          navigator.permissions
        ) {
          try {
            const result = await navigator.permissions.query({
              name: permissionName as PermissionName,
            });
            browserStatus = result.state;
            if (result.state === "granted") {
              return true;
            } else if (result.state === "denied") {
              isBlocked = true;
            }
          } catch {
            // Ignore error, proceed to dialog
          }
        }

        // 2. Check localStorage first (only if not blocked)
        if (!isBlocked && typeof window !== "undefined") {
          const key = `permission_${appName}_${title}`;
          const storedDecision = localStorage.getItem(key);

          if (storedDecision === "allowed") {
            if (browserStatus !== "prompt") {
              return true;
            }
          } else if (storedDecision === "denied") {
            if (browserStatus !== "prompt") {
              return false;
            }
          }
        }

        // 3. Check if a blocked dialog is already active/queued
        if (isBlocked) {
          if (blockedDialogRef.current) {
            return false;
          }
          blockedDialogRef.current = true;
        }

        // 4. Show Dialog
        return new Promise<boolean>((resolve) => {
          const id = Math.random().toString(36).substring(7);
          const newRequest: PermissionRequest = {
            id,
            appName,
            icon,
            title,
            description,
            isBlocked,
            onAllow: () => {
              if (isBlocked) {
                blockedDialogRef.current = false;
                resolve(false);
              } else {
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    `permission_${appName}_${title}`,
                    "allowed"
                  );
                }
                setTimeout(() => {
                  resolve(true);
                }, 300);
              }
              setQueue((prev) => prev.filter((req) => req.id !== id));
            },
            onDeny: () => {
              if (isBlocked) {
                blockedDialogRef.current = false;
              }
              if (!isBlocked && typeof window !== "undefined") {
                localStorage.setItem(
                  `permission_${appName}_${title}`,
                  "denied"
                );
              }
              resolve(false);
              setQueue((prev) => prev.filter((req) => req.id !== id));
            },
          };
          setQueue((prev) => [...prev, newRequest]);
        });
      })();

      // Store the promise and ensure cleanup on completion
      const finalPromise = executionPromise.finally(() => {
        pendingPromises.current.delete(requestKey);
      });

      pendingPromises.current.set(requestKey, finalPromise);
      return finalPromise;
    },
    []
  );

  const currentRequest = queue[0];

  return (
    <PermissionContext.Provider value={{ requestPermission }}>
      {children}
      {mounted && currentRequest && (
        <PermissionDialog
          isOpen={!!currentRequest}
          appName={currentRequest.appName}
          icon={currentRequest.icon}
          title={currentRequest.title}
          description={currentRequest.description}
          onAllow={currentRequest.onAllow}
          onDeny={currentRequest.onDeny}
          isBlocked={currentRequest.isBlocked}
        />
      )}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }
  return context;
};
