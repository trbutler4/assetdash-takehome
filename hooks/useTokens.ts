import { useQuery } from "@tanstack/react-query";
import { tokenApi } from "@/services/api";
import { TokenList } from "@/types/token";

const QUERY_KEY = ["tokens"] as const;

export const useTokens = () => {
  return useQuery<TokenList, Error>({
    queryKey: QUERY_KEY,
    queryFn: tokenApi.fetchTokenList,
    staleTime: 0, // Always fetch fresh data
    refetchInterval: 1000 * 10, // Auto-refetch every 10 seconds
    refetchOnMount: true, // Always fetch on mount
    refetchOnWindowFocus: false, // Don't refetch on focus
    refetchOnReconnect: true, // Refetch on reconnect
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
