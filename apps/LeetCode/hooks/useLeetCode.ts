import { useState, useEffect } from "react";
import { LeetCodeData } from "../types";

export const useLeetCode = () => {
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

  return { loading, data, error, fetchData, username, url };
};
