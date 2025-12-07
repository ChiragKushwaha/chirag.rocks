import React, { useState } from "react";
import { AvatarEditor } from "../components/AvatarEditor";
import { Sidebar } from "../components/SystemSettings/Sidebar";

// Views
import { WifiView } from "../components/SystemSettings/views/WifiView";
import { BluetoothView } from "../components/SystemSettings/views/BluetoothView";
import { NetworkView } from "../components/SystemSettings/views/NetworkView";
import { GeneralView } from "../components/SystemSettings/views/GeneralView";
import { AppleAccountView } from "../components/SystemSettings/views/AppleAccountView";
import { LanguageRegionView } from "../components/SystemSettings/views/LanguageRegionView";
import { AppearanceView } from "../components/SystemSettings/views/AppearanceView";
import { AccessibilityView } from "../components/SystemSettings/views/AccessibilityView";
import { MenuBarView } from "../components/SystemSettings/views/MenuBarView";
import { DesktopDockView } from "../components/SystemSettings/views/DesktopDockView";
import { DisplaysView } from "../components/SystemSettings/views/DisplaysView";
import { SpotlightView } from "../components/SystemSettings/views/SpotlightView";
import { WallpaperView } from "../components/SystemSettings/views/WallpaperView";
import { ScreenSaverView } from "../components/SystemSettings/views/ScreenSaverView";
import { BatteryView } from "../components/SystemSettings/views/BatteryView";
import { SoundView } from "../components/SystemSettings/views/SoundView";
import { NotificationsView } from "../components/SystemSettings/views/NotificationsView";
import { FocusView } from "../components/SystemSettings/views/FocusView";
import { ScreenTimeView } from "../components/SystemSettings/views/ScreenTimeView";
import { PrivacySecurityView } from "../components/SystemSettings/views/PrivacySecurityView";
import { LockScreenView } from "../components/SystemSettings/views/LockScreenView";
import { TouchIDPasswordView } from "../components/SystemSettings/views/TouchIDPasswordView";
import { UsersGroupsView } from "../components/SystemSettings/views/UsersGroupsView";
import { KeyboardView } from "../components/SystemSettings/views/KeyboardView";
import { TrackpadView } from "../components/SystemSettings/views/TrackpadView";
import { PrintersScannersView } from "../components/SystemSettings/views/PrintersScannersView";
import { StorageView } from "../components/SystemSettings/views/StorageView";
import { Info } from "lucide-react";

import { useSystemStore } from "../store/systemStore";

// ... existing imports

export const SystemSettings: React.FC = () => {
  const {
    settingsTab: activeTab,
    setSettingsTab: setActiveTab,
    settingsSubTab: generalSubView,
    setSettingsSubTab: setGeneralSubView,
  } = useSystemStore();

  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState("🦅");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "General") {
      setGeneralSubView("main");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Wi-Fi":
        return <WifiView />;
      case "Bluetooth":
        return <BluetoothView />;
      case "Network":
        return <NetworkView />;
      case "General":
        if (generalSubView === "language") {
          return (
            <LanguageRegionView onBack={() => setGeneralSubView("main")} />
          );
        }
        return (
          <GeneralView
            onNavigate={(view: string) =>
              setGeneralSubView(view as "main" | "language")
            }
          />
        );
      case "Apple Account":
        return (
          <AppleAccountView
            currentAvatar={currentAvatar}
            onEditAvatar={() => setIsAvatarEditorOpen(true)}
          />
        );
      case "Appearance":
        return <AppearanceView />;
      case "Accessibility":
        return <AccessibilityView />;
      case "Menu Bar":
        return <MenuBarView />;
      case "Desktop & Dock":
        return <DesktopDockView />;
      case "Displays":
        return <DisplaysView />;
      case "Spotlight":
        return <SpotlightView />;
      case "Wallpaper":
        return <WallpaperView />;
      case "Screen Saver":
        return <ScreenSaverView />;
      case "Battery":
        return <BatteryView />;
      case "Sound":
        return <SoundView />;
      case "Notifications":
        return <NotificationsView />;
      case "Focus":
        return <FocusView />;
      case "Screen Time":
        return <ScreenTimeView />;
      case "Privacy & Security":
        return <PrivacySecurityView />;
      case "Lock Screen":
        return <LockScreenView />;
      case "Touch ID & Password":
        return <TouchIDPasswordView />;
      case "Users & Groups":
        return <UsersGroupsView />;
      case "Keyboard":
        return <KeyboardView />;
      case "Trackpad":
        return <TrackpadView />;
      case "Printers & Scanners":
        return <PrintersScannersView />;
      case "Storage":
        return <StorageView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Info size={32} />
            </div>
            <p>This section is not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-[#f5f5f7] dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans select-none relative">
      <AvatarEditor
        isOpen={isAvatarEditorOpen}
        onClose={() => setIsAvatarEditorOpen(false)}
        onSave={(newAvatar) => {
          setCurrentAvatar(newAvatar);
          setIsAvatarEditorOpen(false);
        }}
        currentAvatar={currentAvatar}
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentAvatar={currentAvatar}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-2xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
};
