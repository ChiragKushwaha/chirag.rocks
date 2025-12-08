import React from "react";
import { CheckCircle2 } from "lucide-react";
import { LeetCodeData } from "../types";

interface SolvedProblemsProps {
  matchedUser: LeetCodeData["matchedUser"];
}

import { useTranslations } from "next-intl";

interface SolvedProblemsProps {
  matchedUser: LeetCodeData["matchedUser"];
}

export const SolvedProblems: React.FC<SolvedProblemsProps> = ({
  matchedUser,
}) => {
  const t = useTranslations("LeetCode.Solved");
  const totalSolved = matchedUser.submitStats.acSubmissionNum[0].count;
  const totalQuestions = matchedUser.submitStats.acSubmissionNum[0].submissions;

  return (
    <div className="bg-[#282828] rounded-lg p-4">
      <div className="flex items-center gap-8 h-full">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0 ml-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3c3c3c"
              strokeWidth="2.5"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#ffa116"
              strokeWidth="2.5"
              strokeDasharray={`${(totalSolved / totalQuestions) * 100}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-bold text-white">
                {totalSolved}
              </span>
              <span className="text-xs text-gray-500">/{totalQuestions}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={12} className="text-[#00b8a3]" />
              <span className="text-xs text-gray-400 font-medium">
                {t("Solved")}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 flex flex-col gap-3 pr-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400 font-medium">{t("Easy")}</span>
              <span className="font-bold text-white">
                {matchedUser.submitStats.acSubmissionNum[1].count}
                <span className="text-gray-500 font-normal">
                  /{matchedUser.submitStats.acSubmissionNum[1].submissions}
                </span>
              </span>
            </div>
            <div className="h-1.5 bg-[#3c3c3c] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#00b8a3]"
                style={{ width: "40%" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400 font-medium">{t("Medium")}</span>
              <span className="font-bold text-white">
                {matchedUser.submitStats.acSubmissionNum[2].count}
                <span className="text-gray-500 font-normal">
                  /{matchedUser.submitStats.acSubmissionNum[2].submissions}
                </span>
              </span>
            </div>
            <div className="h-1.5 bg-[#3c3c3c] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#ffc01e]"
                style={{ width: "30%" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400 font-medium">{t("Hard")}</span>
              <span className="font-bold text-white">
                {matchedUser.submitStats.acSubmissionNum[3].count}
                <span className="text-gray-500 font-normal">
                  /{matchedUser.submitStats.acSubmissionNum[3].submissions}
                </span>
              </span>
            </div>
            <div className="h-1.5 bg-[#3c3c3c] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#ff375f]"
                style={{ width: "15%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
