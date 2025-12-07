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
import { useTranslations } from "next-intl";

export const AccessibilityView = () => {
  const t = useTranslations("SystemSettings.Accessibility");

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
            {t("Title")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("Description")}{" "}
            <span className="text-blue-500 cursor-pointer">
              {t("LearnMore")}
            </span>
          </p>
        </div>
      </div>

      <SettingsGroup title={t("Vision")}>
        <SettingsRow icon={ScanFace} label={t("VoiceOver")} color="#8E8E93" />
        <SettingsRow icon={ZoomIn} label={t("Zoom")} color="#007AFF" />
        <SettingsRow icon={Type} label={t("HoverText")} color="#007AFF" />
        <SettingsRow icon={Monitor} label={t("Display")} color="#007AFF" />
        <SettingsRow icon={Activity} label={t("Motion")} color="#34C759" />
        <SettingsRow
          icon={MessageSquare}
          label={t("ReadSpeak")}
          color="#8E8E93"
        />
        <SettingsRow
          icon={MessageSquare}
          label={t("AudioDescriptions")}
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title={t("Hearing")}>
        <SettingsRow icon={Ear} label={t("HearingDevices")} color="#007AFF" />
        <SettingsRow icon={Volume2} label={t("Audio")} color="#FF2D55" />
        <SettingsRow icon={Subtitles} label={t("Captions")} color="#8E8E93" />
        <SettingsRow
          icon={MessageSquare}
          label={t("LiveCaptions")}
          color="#007AFF"
        />
        <SettingsRow
          icon={User}
          label={t("NameRecognition")}
          color="#007AFF"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title={t("Motor")}>
        <SettingsRow icon={Mic} label={t("VoiceControl")} color="#007AFF" />
        <SettingsRow icon={Keyboard} label={t("Keyboard")} color="#8E8E93" />
        <SettingsRow
          icon={MousePointer2}
          label={t("PointerControl")}
          color="#007AFF"
        />
        <SettingsRow
          icon={ToggleLeft}
          label={t("SwitchControl")}
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title={t("General")}>
        <SettingsRow icon={Mic} label={t("Siri")} color="#5856D6" />
        <SettingsRow
          icon={Command}
          label={t("Shortcut")}
          color="#007AFF"
          isLast
        />
      </SettingsGroup>
    </div>
  );
};
