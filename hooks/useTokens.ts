import { useQuery } from "@tanstack/react-query";
import { tokenApi } from "@/services/api";
import { TokenList } from "@/types/token";
import { QUERY_CONFIG, API_CONFIG } from "@/constants/app";

/**
 * Query key for token list data
 */
const QUERY_KEY = ["tokens"] as const;

/**
 * Calculate retry delay with exponential backoff
 * @param attemptIndex - The current attempt number (0-based)
 * @returns Delay in milliseconds before next retry
 */
const calculateRetryDelay = (attemptIndex: number): number => {
  const exponentialDelay = API_CONFIG.RETRY.BASE_DELAY * Math.pow(2, attemptIndex);
  return Math.min(exponentialDelay, API_CONFIG.RETRY.MAX_DELAY);
};

/**
 * Hook to fetch and manage token list data
 * Automatically refetches data at regular intervals
 * @returns Query result with token list data, loading state, and error
 */
export const useTokens = () => {
  return useQuery<TokenList, Error>({
    queryKey: QUERY_KEY,
    queryFn: tokenApi.fetchTokenList,
    staleTime: QUERY_CONFIG.STALE_TIME,
    refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL,
    refetchOnMount: QUERY_CONFIG.REFETCH_ON_MOUNT,
    refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
    refetchOnReconnect: QUERY_CONFIG.REFETCH_ON_RECONNECT,
    retry: API_CONFIG.RETRY.ATTEMPTS,
    retryDelay: calculateRetryDelay,
  });
};
