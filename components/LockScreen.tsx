import { X } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useSystemStore } from "../store/systemStore";
import { MenuBar } from "./MenuBar";
import { WallpaperManager } from "../lib/WallpaperManager";
import { useAsset } from "./hooks/useIconManager";
import { useTranslations } from "next-intl";

export const LockScreen: React.FC = () => {
  const t = useTranslations("LockScreen");
  const { isLocked, isInitialized, unlock } = useAuth();
  const { wallpaperName, theme, user, isDark } = useSystemStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(true);

  // Get wallpaper the same way Desktop does
  const wallpaper = WallpaperManager.getWallpaperPath(
    wallpaperName,
    isDark ? "dark" : "light"
  );
  const wallpaperUrl = useAsset(wallpaper);

  const handleUnlock = () => {
    const success = unlock(password, user.password);
    if (success) {
      setPassword("");
      setError("");
      setShowPasswordField(true);
    } else {
      setError(t("IncorrectPassword"));
      setPassword("");
    }
  };

  const handleCancel = () => {
    setPassword("");
    setError("");
    setShowPasswordField(false); // Hide the password field
  };

  const handleUserClick = () => {
    setShowPasswordField(true); // Show the password field when user clicks on icon/name
  };

  // Don't render until initialized
  if (!isInitialized || !isLocked) return null;

  // Use wallpaperUrl from useAsset, or fallback to direct path
  const backgroundImage = wallpaperUrl || wallpaper;

  // URL encode the path for CSS background-image (handles spaces)
  const encodedBackground = backgroundImage
    ? encodeURI(backgroundImage)
    : undefined;

  console.log("[LockScreen] Wallpaper debug:", {
    wallpaperName,
    theme,
    wallpaper,
    wallpaperUrl,
    backgroundImage,
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex flex-col bg-cover bg-center bg-black"
      style={{
        zIndex: 999999,
        backgroundImage: encodedBackground
          ? `url("${encodedBackground}")`
          : undefined,
      }}
    >
      {/* Reuse MenuBar Component */}
      <div className="relative z-50">
        <MenuBar lockScreenMode={true} />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* User Avatar - Fingerprint Circle */}
        <div
          onClick={handleUserClick}
          className="w-28 h-28 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border-4 border-white/50 dark:border-white/30 flex items-center justify-center mb-6 shadow-2xl cursor-pointer hover:bg-white/30 dark:hover:bg-black/30 transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleUserClick();
            }
          }}
          aria-label={t("Aria.UserAvatar")}
        >
          {/* Fingerprint icon */}
          <svg
            className="w-14 h-14 text-white/90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 11c0 .338-.012.673-.037 1M12 11V8m0 3c-1.763 0-3.4.537-4.762 1.456M12 11c1.763 0 3.4.537 4.762 1.456M12 8c-1.657 0-3 1.343-3 3m3-3c1.657 0 3 1.343 3 3m-3-3V5m-3 6L6.97 8.97M15 11l2.03-2.03M9 11c0 1.306-.839 2.414-2.009 2.829M15 11c0 1.306.839 2.414 2.009 2.829M18.25 12.5a7.255 7.255 0 0 1-2.27 5.271M5.75 12.5a7.255 7.255 0 0 0 2.27 5.271M16 17c-1.074.935-2.48 1.5-4 1.5s-2.926-.565-4-1.5" />
          </svg>
        </div>

        {/* User Name */}
        <div
          onClick={handleUserClick}
          className="text-white text-2xl font-medium mb-8 drop-shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleUserClick();
            }
          }}
          aria-label={t("Aria.User", { name: user.name || t("Guest") })}
        >
          {user.name || t("Guest")}
        </div>

        {/* Password Input - Big Sur Style - Show only if showPasswordField is true */}
        {showPasswordField && (
          <div className="animate-fade-in">
            <div className="relative mb-3">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                placeholder={t("EnterPassword")}
                aria-label={t("Aria.Password")}
                className={`w-[320px] bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-xl border ${
                  error
                    ? "border-red-500"
                    : "border-white/20 dark:border-white/10"
                } rounded-lg px-5 py-3 text-center text-black dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-2xl ${
                  error ? "animate-shake" : ""
                }`}
                autoFocus
              />
              {password && (
                <button
                  onClick={handleUnlock}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-lg"
                  aria-label={t("Aria.Submit")}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-sm font-medium mb-3 drop-shadow text-center">
                {error}
              </p>
            )}

            {/* Hint Text */}
            <p className="text-white/80 dark:text-white/70 text-xs drop-shadow text-center">
              {t("Hint", { hint: user.password || "Dumas" })}
            </p>
          </div>
        )}
      </div>

      {/* Cancel Button at Bottom */}
      {!showPasswordField ? (
        <div className="pb-12 flex justify-center">
          <button
            onClick={handleUserClick}
            className="flex flex-col items-center gap-2 text-white/90 hover:text-white transition-colors group"
          >
            <div className="w-11 h-11 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 dark:hover:bg-white/15 flex items-center justify-center transition-all shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <span className="text-xs font-medium drop-shadow">
              {t("Login")}
            </span>
          </button>
        </div>
      ) : (
        <div className="pb-12 flex justify-center">
          <button
            onClick={handleCancel}
            className="flex flex-col items-center gap-2 text-white/90 hover:text-white transition-colors group"
          >
            <div className="w-11 h-11 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 dark:hover:bg-white/15 flex items-center justify-center transition-all shadow-lg">
              <X size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-medium drop-shadow">
              {t("Cancel")}
            </span>
          </button>
        </div>
      )}

      {/* Shake animation CSS */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-8px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(8px);
          }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};
