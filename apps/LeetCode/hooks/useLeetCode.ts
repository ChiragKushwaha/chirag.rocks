import { useQuery } from "@tanstack/react-query";
import { LeetCodeData } from "../types";

export const useLeetCode = () => {
  const username = "ChiragKushwaha";
  const url = `https://leetcode.com/u/${username}/`;

  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch: fetchData,
  } = useQuery({
    queryKey: ["leetcode", username],
    queryFn: async () => {
      const res = await fetch(`/api/leetcode?username=${username}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json as LeetCodeData;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    loading,
    data,
    error: queryError ? "Failed to load LeetCode profile" : null,
    fetchData,
    username,
    url,
  };
};
