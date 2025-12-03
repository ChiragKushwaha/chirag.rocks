import React from "react";
import { MessageSquare } from "lucide-react";
import { LeetCodeData } from "../types";

interface RecentSubmissionsProps {
  recentAcSubmissionList: LeetCodeData["recentAcSubmissionList"];
}

export const RecentSubmissions: React.FC<RecentSubmissionsProps> = ({
  recentAcSubmissionList,
}) => {
  return (
    <div className="bg-[#282828] rounded-lg p-4">
      <div className="flex gap-6 mb-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white font-medium text-sm cursor-pointer">
          <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-[1px]" />
          </div>
          Recent AC
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-white/5 rounded-lg font-medium text-sm cursor-pointer transition-colors">
          <div className="w-4 h-4 border-2 border-gray-500 rounded-sm" />
          List
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-white/5 rounded-lg font-medium text-sm cursor-pointer transition-colors">
          <div className="w-4 h-4 border-2 border-gray-500 rounded-sm" />
          Solutions
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-white/5 rounded-lg font-medium text-sm cursor-pointer transition-colors">
          <MessageSquare size={16} />
          Discuss
        </div>
      </div>

      <div className="flex flex-col">
        {recentAcSubmissionList.map((sub, i) => (
          <div
            key={sub.id}
            className={`flex items-center justify-between py-3 px-4 hover:bg-white/5 transition-colors rounded-lg ${
              i % 2 === 0 ? "bg-[#282828]" : "bg-[#2a2a2a]"
            }`}
          >
            <span className="font-medium text-white text-sm hover:text-blue-400 cursor-pointer transition-colors">
              {sub.title}
            </span>
            <span className="text-xs text-gray-400">2 months ago</span>
          </div>
        ))}
      </div>
    </div>
  );
};
