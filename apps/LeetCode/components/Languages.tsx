import React from "react";
import { LeetCodeData } from "../types";

interface LanguagesProps {
  matchedUser: LeetCodeData["matchedUser"];
}

export const Languages: React.FC<LanguagesProps> = ({ matchedUser }) => {
  return (
    <div className="bg-[#282828] rounded-lg p-4">
      <h3 className="font-bold text-sm mb-4 text-white">Languages</h3>
      <div className="flex flex-col gap-3">
        {matchedUser.languageProblemCount.slice(0, 3).map((lang) => (
          <div
            key={lang.languageName}
            className="flex justify-between items-center text-xs"
          >
            <span className="bg-[#3c3c3c] px-2.5 py-1 rounded-full text-gray-300">
              {lang.languageName}
            </span>
            <span className="text-gray-400">
              <span className="font-bold text-white">
                {lang.problemsSolved}
              </span>{" "}
              problems solved
            </span>
          </div>
        ))}
        <div className="text-xs text-gray-500 mt-1 cursor-pointer hover:text-gray-300">
          Show more
        </div>
      </div>
    </div>
  );
};
