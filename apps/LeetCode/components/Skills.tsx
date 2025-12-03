import React from "react";
import { LeetCodeData } from "../types";

interface SkillsProps {
  matchedUser: LeetCodeData["matchedUser"];
}

export const Skills: React.FC<SkillsProps> = ({ matchedUser }) => {
  return (
    <div className="bg-[#282828] rounded-lg p-4">
      <h3 className="font-bold text-sm mb-4 text-white">Skills</h3>

      <div className="flex flex-col gap-4">
        {/* Advanced */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500"></span> Advanced
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedUser.tagProblemCounts.advanced.slice(0, 3).map((tag) => (
              <span
                key={tag.tagSlug}
                className="bg-[#3c3c3c] px-2.5 py-1 rounded-full text-xs text-gray-300 flex items-center gap-1"
              >
                {tag.tagName}{" "}
                <span className="text-gray-500">x{tag.problemsSolved}</span>
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 ml-1">
            Show more
          </div>
        </div>

        {/* Intermediate */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-yellow-500"></span>{" "}
            Intermediate
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedUser.tagProblemCounts.intermediate
              .slice(0, 3)
              .map((tag) => (
                <span
                  key={tag.tagSlug}
                  className="bg-[#3c3c3c] px-2.5 py-1 rounded-full text-xs text-gray-300 flex items-center gap-1"
                >
                  {tag.tagName}{" "}
                  <span className="text-gray-500">x{tag.problemsSolved}</span>
                </span>
              ))}
          </div>
          <div className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 ml-1">
            Show more
          </div>
        </div>
      </div>
    </div>
  );
};
