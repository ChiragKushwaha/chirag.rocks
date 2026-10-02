import React, { useState } from "react";
import { AvatarEditor } from "../components/AvatarEditor";
import { Sidebar } from "../components/SystemSettings/Sidebar";
import { SettingsContentRouter } from "../components/SystemSettings/SettingsContentRouter";
import { useSystemStore } from "../store/systemStore";

export const SystemSettings: React.FC = () => {
  const {
    settingsTab: activeTab,
    setSettingsTab: setActiveTab,
    settingsSubTab: generalSubView,
    setSettingsSubTab: setGeneralSubView,
    isDark,
  } = useSystemStore();

  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState("🦅");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "General") {
      setGeneralSubView("main");
    }
  };

  return (
    <div
      className="flex h-full select-none relative overflow-hidden font-sans"
      style={{
        background: isDark ? "#1e1e1e" : "#ececf0",
        color: isDark ? "#f5f5f7" : "#1c1c1e",
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

      {/* Big Sur Translucent Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentAvatar={currentAvatar}
      />

      {/* Content Panel */}
      <div
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
        style={{ background: isDark ? "#252527" : "#f2f2f7" }}
      >
        {/* Big Sur Inset Header */}
        <div
          className="h-[52px] flex items-center px-8 shrink-0 border-b select-none"
          style={{
            background: isDark ? "rgba(37,37,39,0.9)" : "rgba(242,242,247,0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          }}
        >
          <h1 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            {activeTab}
          </h1>
        </div>

        {/* Scrollable content container */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="max-w-[640px] mx-auto px-8 py-6">
            <SettingsContentRouter
              activeTab={activeTab}
              generalSubView={generalSubView}
              setGeneralSubView={setGeneralSubView}
              currentAvatar={currentAvatar}
              onEditAvatar={() => setIsAvatarEditorOpen(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
