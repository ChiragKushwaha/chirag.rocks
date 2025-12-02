import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  School,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Eye,
  CheckCircle2,
  MessageSquare,
  Star,
  ChevronRight,
  Globe,
} from "lucide-react";

interface LeetCodeData {
  matchedUser: {
    username: string;
    githubUrl: string | null;
    twitterUrl: string | null;
    linkedinUrl: string | null;
    submitStats: {
      acSubmissionNum: {
        difficulty: string;
        count: number;
        submissions: number;
      }[];
    };
    profile: {
      realName: string;
      userAvatar: string;
      ranking: number;
      reputation: number;
      aboutMe: string;
      school: string;
      countryName: string;
      company: string;
      skillTags: string[];
      websites: string[];
    };
    languageProblemCount: {
      languageName: string;
      problemsSolved: number;
    }[];
    tagProblemCounts: {
      advanced: { tagName: string; problemsSolved: number; tagSlug: string }[];
      intermediate: {
        tagName: string;
        problemsSolved: number;
        tagSlug: string;
      }[];
      fundamental: {
        tagName: string;
        problemsSolved: number;
        tagSlug: string;
      }[];
    };
    badges: {
      id: string;
      displayName: string;
      icon: string;
      creationDate: string;
    }[];
    submissionCalendar: string; // JSON string
  };
  userContestRanking: {
    attendedContestsCount: number;
    rating: number;
    globalRanking: number;
    topPercentage: number;
    badge: {
      name: string;
      icon: string;
    } | null;
  };
  recentAcSubmissionList: {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }[];
}

export const LeetCode = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const username = "ChiragKushwaha";
  const url = `https://leetcode.com/u/${username}/`;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leetcode?username=${username}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch {
      setError("Failed to load LeetCode profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderHeatmap = (calendarJson: string) => {
    const calendar = JSON.parse(calendarJson);
    const today = new Date();
    const yearAgo = new Date();
    yearAgo.setFullYear(today.getFullYear() - 1);

    // Generate weeks
    const weeks = [];
    const current = new Date(yearAgo);
    // Align to Sunday
    current.setDate(current.getDate() - current.getDay());

    while (current <= today) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        let count = 0;
        // Check if any timestamp in calendar matches this day
        const dateStr = current.toDateString();
        Object.keys(calendar).forEach((ts) => {
          if (new Date(parseInt(ts) * 1000).toDateString() === dateStr) {
            count = calendar[ts];
          }
        });

        week.push({ date: new Date(current), count });
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    return (
      <div className="flex gap-[3px] overflow-hidden">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {week.map((day, j) => (
              <div
                key={j}
                className={`w-[11px] h-[11px] rounded-[2px] ${
                  day.count === 0
                    ? "bg-[#3c3c3c]/50"
                    : day.count < 3
                    ? "bg-[#005328]" // Dark green
                    : day.count < 6
                    ? "bg-[#00833e]" // Medium green
                    : "bg-[#00b254]" // Bright green
                }`}
                title={`${day.date.toDateString()}: ${day.count} submissions`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#1a1a1a] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        <div className="text-gray-400">Loading Profile...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-[#1a1a1a] text-white">
        <div className="text-red-400">{error || "No data"}</div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const { matchedUser, recentAcSubmissionList } = data;
  const totalSolved = matchedUser.submitStats.acSubmissionNum[0].count;
  const totalQuestions = matchedUser.submitStats.acSubmissionNum[0].submissions;

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] text-white font-sans selection:bg-blue-500/30">
      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-none p-4 md:p-6 bg-[#1a1a1a]">
        <div className="max-w-[1050px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Profile Card */}
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
                    Rank{" "}
                    <span className="font-bold">
                      {matchedUser.profile.ranking.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-white/90">
                {matchedUser.profile.aboutMe}
              </div>

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
                Go to LeetCode <ExternalLink size={14} />
              </a>
            </div>

            {/* Community Stats */}
            <div className="bg-[#282828] rounded-lg p-4">
              <h3 className="font-bold text-sm mb-4 text-white">
                Community Stats
              </h3>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex items-center gap-3 text-gray-400">
                  <Eye size={16} className="text-blue-500" />
                  <span>Views</span>
                  <span className="ml-auto font-medium text-white">0</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <CheckCircle2 size={16} className="text-blue-500" />
                  <span>Solution</span>
                  <span className="ml-auto font-medium text-white">0</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MessageSquare size={16} className="text-green-500" />
                  <span>Discuss</span>
                  <span className="ml-auto font-medium text-white">0</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Star size={16} className="text-yellow-500" />
                  <span>Reputation</span>
                  <span className="ml-auto font-medium text-white">
                    {matchedUser.profile.reputation}
                  </span>
                </div>
              </div>
            </div>

            {/* Languages */}
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

            {/* Skills */}
            <div className="bg-[#282828] rounded-lg p-4">
              <h3 className="font-bold text-sm mb-4 text-white">Skills</h3>

              <div className="flex flex-col gap-4">
                {/* Advanced */}
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500"></span>{" "}
                    Advanced
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchedUser.tagProblemCounts.advanced
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag.tagSlug}
                          className="bg-[#3c3c3c] px-2.5 py-1 rounded-full text-xs text-gray-300 flex items-center gap-1"
                        >
                          {tag.tagName}{" "}
                          <span className="text-gray-500">
                            x{tag.problemsSolved}
                          </span>
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
                          <span className="text-gray-500">
                            x{tag.problemsSolved}
                          </span>
                        </span>
                      ))}
                  </div>
                  <div className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 ml-1">
                    Show more
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            {/* Top Row: Solved & Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Solved Problems */}
              <div className="bg-[#282828] rounded-lg p-4">
                <div className="flex items-center gap-8 h-full">
                  {/* Circular Progress */}
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0 ml-4">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 36 36"
                    >
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
                        strokeDasharray={`${
                          (totalSolved / totalQuestions) * 100
                        }, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-3xl font-bold text-white">
                          {totalSolved}
                        </span>
                        <span className="text-xs text-gray-500">
                          /{totalQuestions}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={12} className="text-[#00b8a3]" />
                        <span className="text-xs text-gray-400 font-medium">
                          Solved
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-1 flex flex-col gap-3 pr-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400 font-medium">Easy</span>
                        <span className="font-bold text-white">
                          {matchedUser.submitStats.acSubmissionNum[1].count}
                          <span className="text-gray-500 font-normal">
                            /
                            {
                              matchedUser.submitStats.acSubmissionNum[1]
                                .submissions
                            }
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
                        <span className="text-gray-400 font-medium">Med.</span>
                        <span className="font-bold text-white">
                          {matchedUser.submitStats.acSubmissionNum[2].count}
                          <span className="text-gray-500 font-normal">
                            /
                            {
                              matchedUser.submitStats.acSubmissionNum[2]
                                .submissions
                            }
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
                        <span className="text-gray-400 font-medium">Hard</span>
                        <span className="font-bold text-white">
                          {matchedUser.submitStats.acSubmissionNum[3].count}
                          <span className="text-gray-500 font-normal">
                            /
                            {
                              matchedUser.submitStats.acSubmissionNum[3]
                                .submissions
                            }
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

              {/* Badges */}
              <div className="bg-[#282828] rounded-lg p-4 relative">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-xs font-medium text-gray-400 mb-1">
                      Badges
                    </div>
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
                    <div
                      key={badge.id}
                      className="flex flex-col items-center gap-2"
                    >
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
                    <div className="text-xs text-gray-400 mb-1">
                      Most Recent Badge
                    </div>
                    <div className="text-sm font-medium text-white">
                      {matchedUser.badges[0].displayName}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Calendar */}
            <div className="bg-[#282828] rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-lg">
                    {JSON.parse(matchedUser.submissionCalendar)
                      ? Object.values(
                          JSON.parse(matchedUser.submissionCalendar) as Record<
                            string,
                            number
                          >
                        ).reduce((a: number, b: number) => a + b, 0)
                      : 0}
                  </span>
                  <span className="text-gray-400 text-sm">
                    submissions in the past one year
                  </span>
                  <div className="text-gray-500 cursor-help">ⓘ</div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>
                    Total active days:{" "}
                    <span className="text-white font-medium">
                      {
                        Object.keys(JSON.parse(matchedUser.submissionCalendar))
                          .length
                      }
                    </span>
                  </span>
                  <span>
                    Max streak:{" "}
                    <span className="text-white font-medium">64</span>
                  </span>
                  <div className="bg-[#3c3c3c] px-3 py-1.5 rounded text-white flex items-center gap-2 cursor-pointer hover:bg-[#4c4c4c]">
                    Current <ChevronRight size={12} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="w-full overflow-hidden">
                {renderHeatmap(matchedUser.submissionCalendar)}
              </div>

              <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
              </div>
            </div>

            {/* Recent Submissions */}
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
          </div>
        </div>
      </div>
    </div>
  );
};
