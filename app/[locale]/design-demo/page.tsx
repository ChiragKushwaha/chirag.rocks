"use client";

import React, { useState } from "react";
import {
  MacOSButton,
  MacOSNavigationBar,
  MacOSTabBar,
  MacOSSidebar,
  MacOSTooltip,
  MacOSTypography,
  MacOSInput,
  MacOSToggle,
  MacOSSlider,
  IOSAlert,
  IOSActionSheet,
  MacOSWindow,
  MacOSDatePicker,
  MacOSColorPicker,
  MacOSSegmentedControl,
  MacOSActivityIndicator,
  MacOSKeyboard,
  MacOSHomeIndicator,
  MacOSList,
  MacOSMenuBar,
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
  ChevronRight,
  Wifi,
  Battery,
} from "lucide-react";

export default function DesignDemoPage() {
  const { device, isMobile, isTablet, isDesktop, orientation } = useDevice();

  const [activeTab, setActiveTab] = useState("tab1");
  const [activeSidebarItem, setActiveSidebarItem] = useState("item1");
  const [toggleState, setToggleState] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const [date, setDate] = useState(new Date());
  const [color, setColor] = useState("#007AFF");
  const [segment, setSegment] = useState("map");

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

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden">
      {/* Menu Bar (Desktop Only) */}
      {isDesktop && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <MacOSMenuBar
            appName="Design Demo"
            menus={[
              { label: "File" },
              { label: "Edit" },
              { label: "View" },
              { label: "Window" },
              { label: "Help" },
            ]}
          />
        </div>
      )}

      {/* Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <div
          className={`flex-none h-full border-r border-[var(--separator)] ${
            isDesktop ? "pt-[24px]" : ""
          }`}
        >
          <MacOSSidebar
            sections={sidebarSections}
            activeItemId={activeSidebarItem}
            onItemClick={setActiveSidebarItem}
            className="w-[250px]"
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-w-0 relative ${
          isDesktop ? "pt-[24px]" : ""
        }`}
      >
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

          {/* New Components Showcase */}
          <section className="space-y-4">
            <div className="pb-2 border-b border-[var(--separator)]">
              <MacOSTypography variant="title2">New Components</MacOSTypography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6 p-4 bg-[var(--secondary-background)] rounded-xl border border-[var(--separator)]">
                <MacOSTypography variant="headline">Controls</MacOSTypography>

                <div className="space-y-2">
                  <MacOSTypography variant="subhead">
                    Segmented Control
                  </MacOSTypography>
                  <MacOSSegmentedControl
                    value={segment}
                    onChange={setSegment}
                    segments={[
                      { value: "map", label: "Map" },
                      { value: "transit", label: "Transit" },
                      { value: "satellite", label: "Satellite" },
                    ]}
                  />
                </div>

                <div className="flex items-center gap-8">
                  <div className="space-y-2">
                    <MacOSTypography variant="subhead">
                      Date Picker
                    </MacOSTypography>
                    <MacOSDatePicker value={date} onChange={setDate} />
                  </div>
                  <div className="space-y-2">
                    <MacOSTypography variant="subhead">
                      Color Picker
                    </MacOSTypography>
                    <MacOSColorPicker color={color} onChange={setColor} />
                  </div>
                </div>

                <div className="space-y-2">
                  <MacOSTypography variant="subhead">
                    Activity Indicator
                  </MacOSTypography>
                  <div className="flex gap-4 items-center">
                    <MacOSActivityIndicator size="small" />
                    <MacOSActivityIndicator size="medium" />
                    <MacOSActivityIndicator size="large" />
                  </div>
                </div>
              </div>

              {/* Window Demo */}
              <div className="relative h-[300px] bg-[url('/wallpapers/sequoia-light.jpg')] bg-cover rounded-xl border border-[var(--separator)] overflow-hidden">
                <MacOSWindow
                  title="Demo Window"
                  initialPosition={{ x: 20, y: 20 }}
                  initialSize={{ width: 300, height: 200 }}
                  onClose={() => console.log("Close")}
                >
                  <div className="p-4 flex flex-col items-center justify-center h-full text-center">
                    <MacOSTypography variant="body">
                      This is a draggable, resizable macOS window component.
                    </MacOSTypography>
                  </div>
                </MacOSWindow>
              </div>
            </div>
          </section>

          {/* Lists & Keyboard */}
          <section className="space-y-4">
            <div className="pb-2 border-b border-[var(--separator)]">
              <MacOSTypography variant="title2">Lists & Input</MacOSTypography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <MacOSTypography variant="headline">
                  iOS Style List
                </MacOSTypography>
                <MacOSList
                  inset
                  items={[
                    {
                      id: "1",
                      title: "Wi-Fi",
                      subtitle: "Connected",
                      leading: <Wifi size={18} />,
                      trailing: <ChevronRight size={14} />,
                    },
                    {
                      id: "2",
                      title: "Bluetooth",
                      subtitle: "On",
                      leading: <Battery size={18} />,
                      trailing: <ChevronRight size={14} />,
                    },
                    {
                      id: "3",
                      title: "Notifications",
                      leading: <Bell size={18} />,
                      trailing: <ChevronRight size={14} />,
                    },
                  ]}
                />
              </div>

              <div className="space-y-4">
                <MacOSTypography variant="headline">
                  Virtual Keyboard
                </MacOSTypography>
                <MacOSKeyboard onKeyPress={(key) => console.log(key)} />
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
                Body text goes here. It&apos;s the standard text style.
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

        {/* Home Indicator (Mobile Only) */}
        {isMobile && <MacOSHomeIndicator />}

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
