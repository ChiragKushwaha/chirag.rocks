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

import { useSystemStore } from "../store/systemStore";
import { useTranslations } from "next-intl";

export const SystemSettings: React.FC = () => {
  const {
    settingsTab: activeTab,
    setSettingsTab: setActiveTab,
    settingsSubTab: generalSubView,
    setSettingsSubTab: setGeneralSubView,
  } = useSystemStore();

  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState("🦅");
  const t = useTranslations("SystemSettings.Sidebar");

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
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-4xl">
              ⚙️
            </div>
            <p className="text-sm">{t("NotImplemented")}</p>
          </div>
        );
    }
  };

  return (
    <div
      className="flex h-full select-none relative overflow-hidden"
      style={{
        background: "#ececf0",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        color: "#1c1c1e",
      }}
    >
      <AvatarEditor
        isOpen={isAvatarEditorOpen}
        onClose={() => setIsAvatarEditorOpen(false)}
        onSave={(newAvatar) => {
          setCurrentAvatar(newAvatar);
          setIsAvatarEditorOpen(false);
        }}
        currentAvatar={currentAvatar}
      />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentAvatar={currentAvatar}
      />

      {/* Content Panel */}
      <div
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
        style={{ background: "#f2f2f7" }}
      >
        {/* Panel title bar */}
        <div
          className="h-[52px] flex items-center px-8 shrink-0 border-b"
          style={{
            background: "rgba(242,242,247,0.9)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(0,0,0,0.08)",
          }}
        >
          <h1 className="text-[15px] font-semibold text-gray-900">
            {activeTab === "Apple Account" ? "Apple Account" : activeTab}
          </h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[640px] mx-auto px-8 py-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
