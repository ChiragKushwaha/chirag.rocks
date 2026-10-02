import React, { useState } from "react";
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
  Laptop,
} from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { useTranslations } from "next-intl";

interface GeneralViewProps {
  onNavigate: (view: string) => void;
}

export const GeneralView: React.FC<GeneralViewProps> = ({ onNavigate }) => {
  const t = useTranslations("SystemSettings.General");
  const [showAboutModal, setShowAboutModal] = useState(false);

  const cores =
    typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 8 : 8;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const memory =
    typeof navigator !== "undefined" && (navigator as any).deviceMemory
      ? (navigator as any).deviceMemory
      : 16;

  return (
    <div className="pt-8 px-4 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-14 h-14 rounded-full shrink-0 aspect-square shadow-sm bg-gray-400/20 flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold dark:text-white mb-2">
          {t("Title")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {t("Description")}
        </p>
      </div>

      {showAboutModal && (
        <div className="mb-6 p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700/60 shadow-lg flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Laptop size={40} />
          </div>
          <div className="space-y-1 text-sm">
            <h3 className="text-lg font-bold dark:text-white">MacBook Pro</h3>
            <p className="text-xs text-gray-500">16-inch, Apple Silicon</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 pt-2 text-xs">
              <span className="text-gray-500">Chip:</span>
              <span className="font-medium dark:text-gray-200">Apple Silicon ({cores} Cores)</span>
              <span className="text-gray-500">Memory:</span>
              <span className="font-medium dark:text-gray-200">{memory} GB Unified</span>
              <span className="text-gray-500">macOS:</span>
              <span className="font-medium dark:text-gray-200">Big Sur 11.7.10</span>
            </div>
          </div>
        </div>
      )}

      {/* Group 1 */}
      <SettingsGroup>
        <div onClick={() => setShowAboutModal(!showAboutModal)} className="cursor-pointer">
          <SettingsRow
            icon={Info}
            label={t("About")}
            value={showAboutModal ? "Hide Info" : "MacBook Pro"}
            color="#8E8E93"
          />
        </div>
        <SettingsRow
          icon={RefreshCw}
          label={t("SoftwareUpdate")}
          value="macOS 11.7.10 Up to date"
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
