import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        githubUrl
        twitterUrl
        linkedinUrl
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
          realName
          userAvatar
          ranking
          reputation
          aboutMe
          school
          countryName
          company
          skillTags
        }
        languageProblemCount {
          languageName
          problemsSolved
        }
        tagProblemCounts {
          advanced {
            tagName
            tagSlug
            problemsSolved
          }
          intermediate {
            tagName
            tagSlug
            problemsSolved
          }
          fundamental {
            tagName
            tagSlug
            problemsSolved
          }
        }
        badges {
          id
          displayName
          icon
          creationDate
        }
        upcomingBadges {
          name
          icon
          progress
        }
        submissionCalendar
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
        badge {
          name
          icon
        }
      }
      recentAcSubmissionList(username: $username, limit: 10) {
        id
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { error: data.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(data.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch data from LeetCode" },
      { status: 500 }
    );
  }
}
