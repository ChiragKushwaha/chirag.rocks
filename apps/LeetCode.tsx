import React from "react";
import { useLeetCode } from "./LeetCode/hooks/useLeetCode";
import { ProfileCard } from "./LeetCode/components/ProfileCard";
import { CommunityStats } from "./LeetCode/components/CommunityStats";
import { Languages } from "./LeetCode/components/Languages";
import { Skills } from "./LeetCode/components/Skills";
import { SolvedProblems } from "./LeetCode/components/SolvedProblems";
import { Badges } from "./LeetCode/components/Badges";
import { SubmissionCalendar } from "./LeetCode/components/SubmissionCalendar";
import { RecentSubmissions } from "./LeetCode/components/RecentSubmissions";

import { useTranslations } from "next-intl";

export const LeetCode = () => {
  const t = useTranslations("LeetCode.Common");
  const { loading, data, error, fetchData, url } = useLeetCode();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#1a1a1a] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        <div className="text-gray-400">{t("Loading")}</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#1a1a1a] text-white">
        <div className="text-red-400">{error || t("NoData")}</div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
        >
          {t("Retry")}
        </button>
      </div>
    );
  }

  const { matchedUser, recentAcSubmissionList } = data;

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] text-white font-sans selection:bg-blue-500/30">
      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-none p-4 md:p-6 bg-[#1a1a1a]">
        <div className="max-w-[1050px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <ProfileCard matchedUser={matchedUser} url={url} />
            <CommunityStats matchedUser={matchedUser} />
            <Languages matchedUser={matchedUser} />
            <Skills matchedUser={matchedUser} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            {/* Top Row: Solved & Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SolvedProblems matchedUser={matchedUser} />
              <Badges matchedUser={matchedUser} />
            </div>

            <SubmissionCalendar matchedUser={matchedUser} />
            <RecentSubmissions
              recentAcSubmissionList={recentAcSubmissionList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
