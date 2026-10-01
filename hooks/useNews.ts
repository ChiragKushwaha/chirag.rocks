import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";

export interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export function useNews(activeCategory: string) {
  const {
    data: articles = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["news", activeCategory],
    queryFn: async () => {
      const url = `https://saurav.tech/NewsAPI/top-headlines/category/${activeCategory}/us.json`;
      const response = await apiClient.get<NewsResponse>(url);
      return response.data.articles;
    },
    staleTime: 1000 * 60 * 15,
  });

  return { articles, loading, error, refetch };
}
