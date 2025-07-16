import { useQuery } from '@tanstack/react-query';
import { tokenApi } from '@/services/api';
import { TokenList } from '@/types/token';

const QUERY_KEY = ['tokens'] as const;
const STALE_TIME = 1000 * 60 * 5; // 5 minutes
const CACHE_TIME = 1000 * 60 * 10; // 10 minutes

export const useTokens = () => {
  return useQuery<TokenList, Error>({
    queryKey: QUERY_KEY,
    queryFn: tokenApi.fetchTokenList,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};