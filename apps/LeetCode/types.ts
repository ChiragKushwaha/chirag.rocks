export interface LeetCodeData {
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
