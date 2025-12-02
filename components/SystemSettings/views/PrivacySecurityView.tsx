import React from "react";
import { Lock, MapPin, Camera, Mic, Folder, Eye, Shield } from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export const PrivacySecurityView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Lock size={24} className="text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            Privacy & Security
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Control which applications can access your information.
          </p>
        </div>
      </div>

      <SettingsGroup title="Privacy">
        <SettingsRow
          icon={MapPin}
          label="Location Services"
          value="On"
          color="#007AFF"
        />
        <SettingsRow
          icon={Camera}
          label="Camera"
          value="0 apps"
          color="#007AFF"
        />
        <SettingsRow
          icon={Mic}
          label="Microphone"
          value="2 apps"
          color="#007AFF"
        />
        <SettingsRow
          icon={Folder}
          label="Files and Folders"
          value="5 apps"
          color="#007AFF"
        />
        <SettingsRow
          icon={Eye}
          label="Screen Recording"
          value="1 app"
          color="#007AFF"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="Security">
        <SettingsRow label="FileVault" value="On" />
        <SettingsRow label="Lockdown Mode" value="Off" isLast />
      </SettingsGroup>

      <SettingsGroup title="Others">
        <SettingsRow icon={Shield} label="Extensions" color="#8E8E93" />
        <SettingsRow icon={Shield} label="Profiles" color="#8E8E93" isLast />
      </SettingsGroup>
    </div>
  );
};
