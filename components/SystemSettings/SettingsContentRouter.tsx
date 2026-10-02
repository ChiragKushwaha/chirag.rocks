import React from "react";
import { useTranslations } from "next-intl";
import { WifiView } from "./views/WifiView";
import { BluetoothView } from "./views/BluetoothView";
import { NetworkView } from "./views/NetworkView";
import { GeneralView } from "./views/GeneralView";
import { AppleAccountView } from "./views/AppleAccountView";
import { LanguageRegionView } from "./views/LanguageRegionView";
import { AppearanceView } from "./views/AppearanceView";
import { AccessibilityView } from "./views/AccessibilityView";
import { MenuBarView } from "./views/MenuBarView";
import { DesktopDockView } from "./views/DesktopDockView";
import { DisplaysView } from "./views/DisplaysView";
import { SpotlightView } from "./views/SpotlightView";
import { WallpaperView } from "./views/WallpaperView";
import { ScreenSaverView } from "./views/ScreenSaverView";
import { BatteryView } from "./views/BatteryView";
import { SoundView } from "./views/SoundView";
import { NotificationsView } from "./views/NotificationsView";
import { FocusView } from "./views/FocusView";
import { ScreenTimeView } from "./views/ScreenTimeView";
import { PrivacySecurityView } from "./views/PrivacySecurityView";
import { LockScreenView } from "./views/LockScreenView";
import { TouchIDPasswordView } from "./views/TouchIDPasswordView";
import { UsersGroupsView } from "./views/UsersGroupsView";
import { KeyboardView } from "./views/KeyboardView";
import { TrackpadView } from "./views/TrackpadView";
import { PrintersScannersView } from "./views/PrintersScannersView";
import { StorageView } from "./views/StorageView";

interface SettingsContentRouterProps {
  activeTab: string;
  generalSubView: string;
  setGeneralSubView: (view: "main" | "language") => void;
  currentAvatar: string;
  onEditAvatar: () => void;
}

export const SettingsContentRouter: React.FC<SettingsContentRouterProps> = ({
  activeTab,
  generalSubView,
  setGeneralSubView,
  currentAvatar,
  onEditAvatar,
}) => {
  const t = useTranslations("SystemSettings.Sidebar");

  switch (activeTab) {
    case "Wi-Fi": return <WifiView />;
    case "Bluetooth": return <BluetoothView />;
    case "Network": return <NetworkView />;
    case "General":
      return generalSubView === "language" ? (
        <LanguageRegionView onBack={() => setGeneralSubView("main")} />
      ) : (
        <GeneralView onNavigate={(v) => setGeneralSubView(v as "main" | "language")} />
      );
    case "Apple Account":
      return <AppleAccountView currentAvatar={currentAvatar} onEditAvatar={onEditAvatar} />;
    case "Appearance": return <AppearanceView />;
    case "Accessibility": return <AccessibilityView />;
    case "Menu Bar": return <MenuBarView />;
    case "Desktop & Dock": return <DesktopDockView />;
    case "Displays": return <DisplaysView />;
    case "Spotlight": return <SpotlightView />;
    case "Wallpaper": return <WallpaperView />;
    case "Screen Saver": return <ScreenSaverView />;
    case "Battery": return <BatteryView />;
    case "Sound": return <SoundView />;
    case "Notifications": return <NotificationsView />;
    case "Focus": return <FocusView />;
    case "Screen Time": return <ScreenTimeView />;
    case "Privacy & Security": return <PrivacySecurityView />;
    case "Lock Screen": return <LockScreenView />;
    case "Touch ID & Password": return <TouchIDPasswordView />;
    case "Users & Groups": return <UsersGroupsView />;
    case "Keyboard": return <KeyboardView />;
    case "Trackpad": return <TrackpadView />;
    case "Printers & Scanners": return <PrintersScannersView />;
    case "Storage": return <StorageView />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-4xl shadow-xs">
            ⚙️
          </div>
          <p className="text-sm font-medium">{t("NotImplemented") || "Coming Soon"}</p>
        </div>
      );
  }
};
