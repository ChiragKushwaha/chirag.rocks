import React from "react";
import {
  Info,
  RefreshCw,
  HardDrive,
  Heart, // For AppleCare (closest match)
  Share2, // For AirDrop
  Key, // AutoFill/Passwords
  Clock, // Date & Time
  Globe, // Language & Region
  ListChecks, // Login Items
  Share, // Sharing
  Briefcase, // Device Management
  ArrowRightCircle, // Transfer or Reset
  Settings, // For General Header?
} from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

interface GeneralViewProps {
  onNavigate: (view: string) => void;
}

export const GeneralView: React.FC<GeneralViewProps> = ({ onNavigate }) => {
  return (
    <div className="pt-8 px-4 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-400/20 flex items-center justify-center mb-4">
          <Settings className="w-10 h-10 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold dark:text-white mb-2">General</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          Manage your overall setup and preferences for Mac, such as software
          updates, device language, AirDrop and more.
        </p>
      </div>

      {/* Group 1 */}
      <SettingsGroup>
        <SettingsRow icon={Info} label="About" color="#8E8E93" />
        <SettingsRow
          icon={RefreshCw}
          label="Software Update"
          color="#8E8E93" // Usually a cog/gear icon, but refresh works
        />
        <SettingsRow icon={HardDrive} label="Storage" color="#8E8E93" isLast />
      </SettingsGroup>

      {/* Group 2: AppleCare (Using custom icon color or red) */}
      <SettingsGroup>
        <SettingsRow
          icon={Heart} // AppleCare usually Apple logo or heart
          label="AppleCare & Warranty"
          color="#FF2D55"
          isLast
        />
      </SettingsGroup>

      {/* Group 3 */}
      <SettingsGroup>
        <SettingsRow icon={Share2} label="AirDrop & Handoff" color="#007AFF" />
        <SettingsRow
          icon={Key}
          label="AutoFill & Passwords"
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      {/* Group 4 */}
      <SettingsGroup>
        <SettingsRow icon={Clock} label="Date & Time" color="#8E8E93" />
        <SettingsRow
          icon={Globe}
          label="Language & Region"
          color="#007AFF"
          onClick={() => onNavigate("language")}
        />
        <SettingsRow
          icon={ListChecks}
          label="Login Items & Extensions"
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      {/* Group 5 */}
      <SettingsGroup>
        <SettingsRow icon={Share} label="Sharing" color="#007AFF" isLast />
      </SettingsGroup>

      {/* Group 6 */}
      <SettingsGroup>
        <SettingsRow icon={HardDrive} label="Startup Disk" color="#8E8E93" />
        <SettingsRow
          icon={Clock} // Time Machine
          label="Time Machine"
          color="#34C759" // Green
        />
        <SettingsRow
          icon={Briefcase}
          label="Device Management"
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      {/* Group 7 */}
      <SettingsGroup>
        <SettingsRow
          icon={ArrowRightCircle}
          label="Transfer or Reset"
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
