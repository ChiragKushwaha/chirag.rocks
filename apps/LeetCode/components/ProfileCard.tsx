import React from "react";
import {
  ExternalLink,
  MapPin,
  School,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Globe,
} from "lucide-react";
import { LeetCodeData } from "../types";

import { useTranslations } from "next-intl";

interface ProfileCardProps {
  matchedUser: LeetCodeData["matchedUser"];
  url: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  matchedUser,
  url,
}) => {
  const t = useTranslations("LeetCode.Profile");
  const tCommon = useTranslations("LeetCode.Common");

  return (
    <div className="bg-[#282828] rounded-lg p-4 flex flex-col gap-4">
      <div className="flex gap-4 items-start">
        <div className="w-[88px] h-[88px] rounded-lg overflow-hidden bg-black/20 shrink-0 border border-white/5">
          <img
            src={matchedUser.profile.userAvatar}
            alt={matchedUser.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col pt-1">
          <div className="flex items-center gap-1">
            <h1 className="text-lg font-bold leading-tight">
              {matchedUser.profile.realName}
            </h1>
            <div className="text-blue-400" title="Verified">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>
          <div className="text-gray-400 text-xs mb-2">
            @{matchedUser.username}
          </div>
          <div className="text-xs font-medium text-white">
            {t("Rank")}{" "}
            <span className="font-bold">
              {matchedUser.profile.ranking.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="text-sm text-white/90">{matchedUser.profile.aboutMe}</div>

      <div className="flex flex-col gap-3 text-xs text-gray-400 mt-2">
        {matchedUser.profile.company && (
          <div className="flex items-center gap-3">
            <Briefcase size={14} className="opacity-70" />{" "}
            {matchedUser.profile.company}
          </div>
        )}
        {matchedUser.profile.school && (
          <div className="flex items-center gap-3">
            <School size={14} className="opacity-70" />{" "}
            {matchedUser.profile.school}
          </div>
        )}
        {matchedUser.profile.countryName && (
          <div className="flex items-center gap-3">
            <MapPin size={14} className="opacity-70" />{" "}
            {matchedUser.profile.countryName}
          </div>
        )}
        <div className="flex items-center gap-3 text-blue-400">
          <Globe size={14} className="opacity-70 text-gray-400" />
          <a
            href="https://mr-chirag.web.app"
            target="_blank"
            className="hover:underline"
          >
            https://mr-chirag.web.app
          </a>
        </div>
      </div>

      <div className="flex gap-4 mt-1 text-gray-400">
        {matchedUser.githubUrl && (
          <a
            href={matchedUser.githubUrl}
            target="_blank"
            className="hover:text-white transition-colors"
          >
            <Github size={18} />
          </a>
        )}
        {matchedUser.twitterUrl && (
          <a
            href={matchedUser.twitterUrl}
            target="_blank"
            className="hover:text-blue-400 transition-colors"
          >
            <Twitter size={18} />
          </a>
        )}
        {matchedUser.linkedinUrl && (
          <a
            href={matchedUser.linkedinUrl}
            target="_blank"
            className="hover:text-blue-600 transition-colors"
          >
            <Linkedin size={18} />
          </a>
        )}
      </div>

      <a
        href={url}
        target="_blank"
        className="mt-2 w-full flex items-center justify-center gap-2 bg-[#ffa116] hover:bg-[#ffb13d] text-black font-medium py-2 rounded transition-colors text-sm"
      >
        {tCommon("GoToLeetCode")} <ExternalLink size={14} />
      </a>
    </div>
  );
};
