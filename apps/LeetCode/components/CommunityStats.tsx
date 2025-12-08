import React from "react";
import { Eye, CheckCircle2, MessageSquare, Star } from "lucide-react";
import { LeetCodeData } from "../types";

import { useTranslations } from "next-intl";

interface CommunityStatsProps {
  matchedUser: LeetCodeData["matchedUser"];
}

export const CommunityStats: React.FC<CommunityStatsProps> = ({
  matchedUser,
}) => {
  const t = useTranslations("LeetCode.Stats");

  return (
    <div className="bg-[#282828] rounded-lg p-4">
      <h3 className="font-bold text-sm mb-4 text-white">{t("Title")}</h3>
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex items-center gap-3 text-gray-400">
          <Eye size={16} className="text-blue-500" />
          <span>{t("Views")}</span>
          <span className="ml-auto font-medium text-white">0</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <CheckCircle2 size={16} className="text-blue-500" />
          <span>{t("Solution")}</span>
          <span className="ml-auto font-medium text-white">0</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <MessageSquare size={16} className="text-green-500" />
          <span>{t("Discuss")}</span>
          <span className="ml-auto font-medium text-white">0</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <Star size={16} className="text-yellow-500" />
          <span>{t("Reputation")}</span>
          <span className="ml-auto font-medium text-white">
            {matchedUser.profile.reputation}
          </span>
        </div>
      </div>
    </div>
  );
};
