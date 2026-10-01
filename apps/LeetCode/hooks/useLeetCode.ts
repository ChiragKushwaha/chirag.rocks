import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/apiClient";
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
      const response = await apiClient.get<LeetCodeData & { error?: string }>(
        `/api/leetcode?username=${username}`
      );
      if (response.data.error) throw new Error(response.data.error);
      return response.data;
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
