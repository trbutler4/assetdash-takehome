import { useState, useMemo, useCallback } from 'react';
import { Token } from '@/types/token';

const ITEMS_PER_PAGE = 50;

interface UsePaginatedTokensReturn {
  paginatedTokens: Token[];
  loadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  totalCount: number;
  displayedCount: number;
}

export const usePaginatedTokens = (tokens: Token[]): UsePaginatedTokensReturn => {
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const paginatedTokens = useMemo(() => {
    return tokens.slice(0, displayedCount);
  }, [tokens, displayedCount]);

  const hasMore = useMemo(() => {
    return displayedCount < tokens.length;
  }, [displayedCount, tokens.length]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    
    // Simulate a small delay to show loading state
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, tokens.length));
      setIsLoadingMore(false);
    }, 100);
  }, [hasMore, isLoadingMore, tokens.length]);

  // Reset displayed count when tokens change (e.g., after filtering)
  // This ensures we start from the beginning with new data
  const tokenIds = tokens.map(t => t.token_address).join(',');
  useMemo(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [tokenIds]);

  return {
    paginatedTokens,
    loadMore,
    hasMore,
    isLoadingMore,
    totalCount: tokens.length,
    displayedCount: Math.min(displayedCount, tokens.length),
  };
};