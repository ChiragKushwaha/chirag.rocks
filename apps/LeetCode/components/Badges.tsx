import React from "react";
import { ArrowRight } from "lucide-react";
import { LeetCodeData } from "../types";

interface BadgesProps {
  matchedUser: LeetCodeData["matchedUser"];
}

export const Badges: React.FC<BadgesProps> = ({ matchedUser }) => {
  return (
    <div className="bg-[#282828] rounded-lg p-4 relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-xs font-medium text-gray-400 mb-1">Badges</div>
          <div className="text-2xl font-bold text-white">
            {matchedUser.badges.length}
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-gray-500 cursor-pointer hover:text-white"
        />
      </div>

      <div className="flex gap-6">
        {matchedUser.badges.slice(0, 3).map((badge) => (
          <div key={badge.id} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 relative">
              <img
                src={
                  badge.icon.startsWith("http")
                    ? badge.icon
                    : `https://leetcode.com${badge.icon}`
                }
                alt={badge.displayName}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
        ))}
      </div>

      {matchedUser.badges.length > 0 && (
        <div className="mt-6">
          <div className="text-xs text-gray-400 mb-1">Most Recent Badge</div>
          <div className="text-sm font-medium text-white">
            {matchedUser.badges[0].displayName}
          </div>
        </div>
      )}
    </div>
  );
};
