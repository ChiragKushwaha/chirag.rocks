"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSystemStore } from "../../store/systemStore";
import { SETTING_ITEMS } from "./sidebar/types";
import { SidebarSearch } from "./sidebar/SidebarSearch";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { SidebarItemList } from "./sidebar/SidebarItemList";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentAvatar: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentAvatar,
}) => {
  const t = useTranslations("SystemSettings.Sidebar");
  const isDark = useSystemStore((s) => s.isDark);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = searchQuery.trim()
    ? SETTING_ITEMS.filter((item) =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SETTING_ITEMS;

  return (
    <div
      className="w-[240px] shrink-0 flex flex-col overflow-hidden border-r select-none"
      style={{
        background: isDark ? "rgba(30,30,30,0.85)" : "rgba(238,238,242,0.85)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
      }}
    >
      <SidebarSearch
        placeholder={t("Search")}
        value={searchQuery}
        onChange={setSearchQuery}
        isDark={isDark}
      />

      <SidebarUserProfile
        currentAvatar={currentAvatar}
        appleAccountLabel={t("AppleAccount")}
        isActive={activeTab === "Apple Account"}
        isDark={isDark}
        onClick={() => setActiveTab("Apple Account")}
      />

      <div
        className="mx-3.5 mb-2 border-t"
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        }}
      />

      <SidebarItemList
        items={filtered}
        activeTab={activeTab}
        isDark={isDark}
        onSelect={setActiveTab}
      />
    </div>
  );
};
