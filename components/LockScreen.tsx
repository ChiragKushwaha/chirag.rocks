import React, { useState, useEffect } from "react";
import { useSystemStore } from "../store/systemStore";
import { Fingerprint } from "lucide-react";

export const LockScreen: React.FC = () => {
  const { user, isLocked, setLocked, resetIdleTimer, credentialId } =
    useSystemStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePasswordUnlock = () => {
    if (password === user.password) {
      setLocked(false);
      resetIdleTimer();
      setPassword("");
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const handleBiometricUnlock = async () => {
    if (!credentialId) {
      setError("No biometric credential registered");
      return;
    }

    try {
      // Use WebAuthn to authenticate
      const publicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32),
        allowCredentials: [
          {
            id: Uint8Array.from(atob(credentialId), (c) => c.charCodeAt(0)),
            type: "public-key" as const,
            transports: ["internal" as const],
          },
        ],
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      if (assertion) {
        setLocked(false);
        resetIdleTimer();
        setError("");
      }
    } catch (err) {
      console.error("Biometric authentication failed:", err);
      setError("Biometric authentication failed");
    }
  };

  if (!isLocked) return null;

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      }}
    >
      {/* Top Bar - Exactly as in image */}
      <div className="absolute top-4 right-6 flex items-center gap-3 text-white/90 text-[11px]">
        <span>Your screen is being observed 👁️</span>
        <span>ABC – India 🇮🇳</span>
        <span>🔋</span>
        <span>📶</span>
      </div>

      {/* Main Content - Centered */}
      <div className="flex flex-col items-center">
        {/* Date */}
        <div className="text-white/90 text-[15px] font-normal mb-3">
          {formattedDate}
        </div>

        {/* Time - Large Display */}
        <div className="text-white text-[140px] font-thin leading-none tracking-tighter mb-24">
          {formattedTime}
        </div>

        {/* User Avatar - Smaller, cleaner */}
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-3xl font-light shadow-2xl mb-4">
          {user.name.charAt(0).toUpperCase() || "U"}
        </div>

        {/* Password Field - Clean and centered */}
        <div className="relative mb-2">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordUnlock()}
            placeholder="Enter Password"
            className="w-[280px] bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-5 py-2.5 text-center text-white text-[13px] placeholder-white/50 outline-none focus:bg-white/20 focus:border-white/50 transition-all shadow-lg"
            autoFocus
          />
        </div>

        {/* Hint Text */}
        <p className="text-white/70 text-[11px] font-light">
          Touch ID or Enter Password
        </p>

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-red-200 text-[11px] font-medium">{error}</p>
        )}

        {/* Biometric Button - Only if credential exists */}
        {credentialId && (
          <button
            onClick={handleBiometricUnlock}
            className="mt-6 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all"
            title="Use Touch ID"
          >
            <Fingerprint size={24} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
};
