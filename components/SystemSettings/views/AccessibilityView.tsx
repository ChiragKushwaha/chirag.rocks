import React from "react";
import {
  ScanFace,
  ZoomIn,
  Type,
  Monitor,
  Activity,
  MessageSquare,
  Ear,
  Volume2,
  Subtitles,
  User,
  Mic,
  Keyboard,
  MousePointer2,
  ToggleLeft,
  Command,
} from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const AccessibilityView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#007AFF] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-8 bg-white absolute"></div>
              <div className="w-8 h-2 bg-white absolute"></div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            Accessibility
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Personalise Mac in ways that work best for you with accessibility
            features for vision, hearing, motor, speech and cognition.{" "}
            <span className="text-blue-500 cursor-pointer">Learn more...</span>
          </p>
        </div>
      </div>

      <SettingsGroup title="Vision">
        <SettingsRow icon={ScanFace} label="VoiceOver" color="#8E8E93" />
        <SettingsRow icon={ZoomIn} label="Zoom" color="#007AFF" />
        <SettingsRow icon={Type} label="Hover Text" color="#007AFF" />
        <SettingsRow icon={Monitor} label="Display" color="#007AFF" />
        <SettingsRow icon={Activity} label="Motion" color="#34C759" />
        <SettingsRow
          icon={MessageSquare}
          label="Read & Speak"
          color="#8E8E93"
        />
        <SettingsRow
          icon={MessageSquare}
          label="Audio Descriptions"
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="Hearing">
        <SettingsRow icon={Ear} label="Hearing Devices" color="#007AFF" />
        <SettingsRow icon={Volume2} label="Audio" color="#FF2D55" />
        <SettingsRow icon={Subtitles} label="Captions" color="#8E8E93" />
        <SettingsRow
          icon={MessageSquare}
          label="Live Captions"
          color="#007AFF"
        />
        <SettingsRow
          icon={User}
          label="Name Recognition"
          color="#007AFF"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="Motor">
        <SettingsRow icon={Mic} label="Voice Control" color="#007AFF" />
        <SettingsRow icon={Keyboard} label="Keyboard" color="#8E8E93" />
        <SettingsRow
          icon={MousePointer2}
          label="Pointer Control"
          color="#007AFF"
        />
        <SettingsRow
          icon={ToggleLeft}
          label="Switch Control"
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="General">
        <SettingsRow icon={Mic} label="Siri" color="#5856D6" />
        <SettingsRow icon={Command} label="Shortcut" color="#007AFF" isLast />
      </SettingsGroup>
    </div>
  );
};
