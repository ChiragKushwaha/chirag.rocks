import React from "react";
import {
  Info,
  RefreshCw,
  HardDrive,
  Heart,
  Share2,
  Key,
  Clock,
  Globe,
  ListChecks,
  Share,
  Briefcase,
  ArrowRightCircle,
  Settings,
} from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

interface GeneralViewProps {
  onNavigate: (view: string) => void;
}

export const GeneralView: React.FC<GeneralViewProps> = ({ onNavigate }) => {
  const t = useTranslations("SystemSettings.General");

  return (
    <div className="pt-8 px-4 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-400/20 flex items-center justify-center mb-4">
          <Settings className="w-10 h-10 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold dark:text-white mb-2">
          {t("Title")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {t("Description")}
        </p>
      </div>

      {/* Group 1 */}
      <SettingsGroup>
        <SettingsRow icon={Info} label={t("About")} color="#8E8E93" />
        <SettingsRow
          icon={RefreshCw}
          label={t("SoftwareUpdate")}
          color="#8E8E93"
        />
        <SettingsRow
          icon={HardDrive}
          label={t("Storage")}
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      {/* Group 2: AppleCare */}
      <SettingsGroup>
        <SettingsRow
          icon={Heart}
          label={t("AppleCare")}
          color="#FF2D55"
          isLast
        />
      </SettingsGroup>

      {/* Group 3 */}
      <SettingsGroup>
        <SettingsRow icon={Share2} label={t("AirDrop")} color="#007AFF" />
        <SettingsRow icon={Key} label={t("AutoFill")} color="#8E8E93" isLast />
      </SettingsGroup>

      {/* Group 4 */}
      <SettingsGroup>
        <SettingsRow icon={Clock} label={t("DateTime")} color="#8E8E93" />
        <SettingsRow
          icon={Globe}
          label={t("LanguageRegion")}
          color="#007AFF"
          onClick={() => onNavigate("language")}
        />
        <SettingsRow
          icon={ListChecks}
          label={t("LoginItems")}
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      {/* Group 5 */}
      <SettingsGroup>
        <SettingsRow icon={Share} label={t("Sharing")} color="#007AFF" isLast />
      </SettingsGroup>

      {/* Group 6 */}
      <SettingsGroup>
        <SettingsRow
          icon={HardDrive}
          label={t("StartupDisk")}
          color="#8E8E93"
        />
        <SettingsRow icon={Clock} label={t("TimeMachine")} color="#34C759" />
        <SettingsRow
          icon={Briefcase}
          label={t("DeviceManagement")}
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      {/* Group 7 */}
      <SettingsGroup>
        <SettingsRow
          icon={ArrowRightCircle}
          label={t("TransferReset")}
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
