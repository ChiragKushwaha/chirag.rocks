"use client";

import React, { useState } from "react";
import {
  MacOSButton,
  MacOSNavigationBar,
  MacOSTabBar,
  MacOSSidebar,
  MacOSTooltip,
  MacOSContextMenu,
  MacOSTypography,
  MacOSColors,
  MacOSInput,
  MacOSToggle,
  MacOSSlider,
  IOSAlert,
  IOSActionSheet,
} from "@/components/ui/MacOSDesignSystem";
import { useDevice } from "@/components/ui/design-system/DeviceContext";
import {
  Home,
  Settings,
  User,
  Search,
  Bell,
  Menu,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";

export default function DesignDemoPage() {
  const { device, isMobile, isTablet, isDesktop, orientation } = useDevice();

  const [activeTab, setActiveTab] = useState("tab1");
  const [activeSidebarItem, setActiveSidebarItem] = useState("item1");
  const [toggleState, setToggleState] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const sidebarSections = [
    {
      title: "Favorites",
      items: [
        { id: "item1", label: "Home", icon: <Home size={16} /> },
        { id: "item2", label: "Profile", icon: <User size={16} /> },
        { id: "item3", label: "Settings", icon: <Settings size={16} /> },
      ],
    },
    {
      title: "Library",
      items: [
        { id: "item4", label: "Documents", icon: <Menu size={16} /> },
        { id: "item5", label: "Recent", icon: <Search size={16} /> },
      ],
    },
  ];

  const tabs = [
    { id: "tab1", label: "Home", icon: <Home size={20} /> },
    { id: "tab2", label: "Search", icon: <Search size={20} /> },
    { id: "tab3", label: "Notifications", icon: <Bell size={20} /> },
    { id: "tab4", label: "Profile", icon: <User size={20} /> },
  ];

  const contextMenuItems = [
    { id: "1", label: "New Folder" },
    { id: "2", label: "Get Info", shortcut: "⌘I" },
    { id: "3", separator: true, label: "" },
    { id: "4", label: "Copy", shortcut: "⌘C" },
    { id: "5", label: "Paste", shortcut: "⌘V", disabled: true },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden">
      {/* Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <div className="flex-none h-full border-r border-[var(--separator)]">
          <MacOSSidebar
            sections={sidebarSections}
            activeItemId={activeSidebarItem}
            onItemClick={setActiveSidebarItem}
            className="w-[250px]"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <MacOSNavigationBar
          title="Design System Demo"
          leading={
            <MacOSButton size="default">
              <Menu size={14} />
            </MacOSButton>
          }
          trailing={
            <div className="flex gap-2">
              <MacOSTooltip content="Search">
                <MacOSButton size="default">
                  <Search size={14} />
                </MacOSButton>
              </MacOSTooltip>
              <MacOSButton variant="primary" size="default">
                Save
              </MacOSButton>
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
          {/* Device Context Info */}
          <section className="space-y-4">
            <div className="pb-2 border-b border-[var(--separator)]">
              <MacOSTypography variant="title2">Device Context</MacOSTypography>
            </div>
            <div className="flex gap-4 items-center p-4 bg-[var(--secondary-background)] rounded-xl border border-[var(--separator)]">
              {isMobile ? (
                <Smartphone size={32} />
              ) : isTablet ? (
                <Tablet size={32} />
              ) : (
                <Monitor size={32} />
              )}
              <div>
                <MacOSTypography variant="headline" className="capitalize">
                  {device} Mode
                </MacOSTypography>
                <MacOSTypography
                  variant="caption1"
                  className="text-[var(--secondary-label)] capitalize"
                >
                  {orientation} Orientation
                </MacOSTypography>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section className="space-y-4">
            <div className="pb-2 border-b border-[var(--separator)]">
              <MacOSTypography variant="title2">Typography</MacOSTypography>
            </div>
            <div className="space-y-2">
              <MacOSTypography variant="largeTitle">
                Large Title
              </MacOSTypography>
              <MacOSTypography variant="title1">Title 1</MacOSTypography>
              <MacOSTypography variant="title2">Title 2</MacOSTypography>
              <MacOSTypography variant="headline">Headline</MacOSTypography>
              <MacOSTypography variant="body">
                Body text goes here. It's the standard text style.
              </MacOSTypography>
              <MacOSTypography variant="caption1">Caption 1</MacOSTypography>
            </div>
          </section>

          {/* Components Section */}
          <section className="space-y-4">
            <div className="pb-2 border-b border-[var(--separator)]">
              <MacOSTypography variant="title2">
                Interactive Components
              </MacOSTypography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-4 bg-[var(--secondary-background)] rounded-xl border border-[var(--separator)]">
                <MacOSTypography variant="headline">
                  Buttons & Inputs
                </MacOSTypography>
                <div className="flex flex-wrap gap-2">
                  <MacOSButton variant="primary">Primary</MacOSButton>
                  <MacOSButton variant="secondary">Secondary</MacOSButton>
                  <MacOSButton variant="destructive">Destructive</MacOSButton>
                </div>
                <div className="space-y-2">
                  <MacOSInput placeholder="Standard Input" />
                  <div className="flex items-center gap-4">
                    <MacOSToggle
                      label="Toggle Me"
                      checked={toggleState}
                      onChange={setToggleState}
                    />
                    <MacOSSlider
                      value={sliderValue}
                      min={0}
                      max={100}
                      onChange={setSliderValue}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 bg-[var(--secondary-background)] rounded-xl border border-[var(--separator)]">
                <MacOSTypography variant="headline">
                  iOS Components
                </MacOSTypography>
                <div className="flex flex-col gap-3">
                  <MacOSButton onClick={() => setIsAlertOpen(true)}>
                    Show iOS Alert
                  </MacOSButton>
                  <MacOSButton onClick={() => setIsActionSheetOpen(true)}>
                    Show iOS Action Sheet
                  </MacOSButton>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Tab Bar (Mobile style or Bottom Toolbar) */}
        <div className="flex-none">
          <MacOSTabBar
            tabs={tabs}
            activeTabId={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* iOS Overlays */}
        <IOSAlert
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          title="Allow Notifications?"
          message="This app would like to send you notifications."
          actions={[
            {
              label: "Don't Allow",
              style: "cancel",
              onClick: () => console.log("Cancel"),
            },
            { label: "Allow", onClick: () => console.log("Allow") },
          ]}
        />

        <IOSActionSheet
          isOpen={isActionSheetOpen}
          onClose={() => setIsActionSheetOpen(false)}
          title="Choose an option"
          message="This is a description of the action sheet."
          actions={[
            { label: "Share", onClick: () => console.log("Share") },
            { label: "Edit", onClick: () => console.log("Edit") },
            {
              label: "Delete",
              style: "destructive",
              onClick: () => console.log("Delete"),
            },
            {
              label: "Cancel",
              style: "cancel",
              onClick: () => console.log("Cancel"),
            },
          ]}
        />
      </div>
    </div>
  );
}
