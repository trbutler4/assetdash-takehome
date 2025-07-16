import { useEffect, useState, useCallback, useRef } from 'react';
import { Token } from '@/types/token';

const PRICE_UPDATE_INTERVAL = 10000; // 10 seconds
const MIN_TOKENS_TO_UPDATE = 3;
const MAX_TOKENS_TO_UPDATE = 8;
const MAX_PRICE_CHANGE_PERCENT = 0.15; // Max 15% price change

export const usePriceUpdates = (initialTokens: Token[]) => {
  const [updatedTokens, setUpdatedTokens] = useState<Token[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateRandomPriceChange = () => {
    // Generate a random price change between -15% and +15%
    return (Math.random() - 0.5) * 2 * MAX_PRICE_CHANGE_PERCENT;
  };

  const updateTokenPrice = (token: Token): Token => {
    // Skip tokens with null prices
    if (token.price_usd == null) {
      return token;
    }

    const priceChangePercent = generateRandomPriceChange();
    const newPrice = token.price_usd * (1 + priceChangePercent);
    const newMarketCap = token.total_supply != null ? newPrice * token.total_supply : token.market_cap_usd;

    // Update price change percentages (simulate realistic changes)
    const updatedPriceChangePercent = token.price_change_percent ? {
      m5: priceChangePercent * 100,
      m30: (token.price_change_percent.m30 ?? 0) * 0.9 + priceChangePercent * 10,
      h1: (token.price_change_percent.h1 ?? 0) * 0.8 + priceChangePercent * 5,
      h4: (token.price_change_percent.h4 ?? 0) * 0.7 + priceChangePercent * 2,
      h8: (token.price_change_percent.h8 ?? 0) * 0.6 + priceChangePercent * 1,
      h24: (token.price_change_percent.h24 ?? 0) * 0.5 + priceChangePercent * 0.5,
    } : token.price_change_percent;

    // Simulate volume changes
    const volumeMultiplier = 1 + Math.random() * 0.3;
    const updatedVolume = token.volume_usd ? {
      m5: (token.volume_usd.m5 ?? 0) * volumeMultiplier,
      m30: (token.volume_usd.m30 ?? 0) * (0.9 + Math.random() * 0.2),
      h1: (token.volume_usd.h1 ?? 0) * (0.95 + Math.random() * 0.1),
      h4: (token.volume_usd.h4 ?? 0) * (0.98 + Math.random() * 0.04),
      h8: (token.volume_usd.h8 ?? 0) * (0.99 + Math.random() * 0.02),
      h24: (token.volume_usd.h24 ?? 0) * (0.995 + Math.random() * 0.01),
    } : token.volume_usd;

    return {
      ...token,
      price_usd: newPrice,
      market_cap_usd: newMarketCap,
      price_change_percent: updatedPriceChangePercent,
      volume_usd: updatedVolume,
    };
  };

  const updateRandomTokens = useCallback((tokens: Token[]) => {
    if (tokens.length === 0) return tokens;

    // Determine how many tokens to update
    const tokensToUpdateCount = Math.floor(
      Math.random() * (MAX_TOKENS_TO_UPDATE - MIN_TOKENS_TO_UPDATE + 1) + MIN_TOKENS_TO_UPDATE
    );

    // Get random indices to update
    const indicesToUpdate = new Set<number>();
    while (indicesToUpdate.size < Math.min(tokensToUpdateCount, tokens.length)) {
      indicesToUpdate.add(Math.floor(Math.random() * tokens.length));
    }

    // Only create new array if we have tokens to update
    if (indicesToUpdate.size === 0) return tokens;

    // Create new array with minimal changes
    return tokens.map((token, index) => {
      if (indicesToUpdate.has(index)) {
        return updateTokenPrice(token);
      }
      return token; // Keep reference to unchanged token
    });
  }, []);

  // Initialize tokens when they change
  useEffect(() => {
    if (initialTokens.length > 0) {
      setUpdatedTokens(initialTokens);
      
      // Reset the interval to start fresh with new data
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [initialTokens]);

  // Set up the interval for price updates
  useEffect(() => {
    // Only start interval if we have tokens and haven't started one already
    if (updatedTokens.length > 0 && !intervalRef.current) {
      const updatePrices = () => {
        setUpdatedTokens(currentTokens => {
          const newTokens = updateRandomTokens(currentTokens);
          // Only update state if tokens actually changed
          return newTokens === currentTokens ? currentTokens : newTokens;
        });
      };

      // Start the interval
      intervalRef.current = setInterval(updatePrices, PRICE_UPDATE_INTERVAL);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateRandomTokens]);

  // Return the original tokens if we haven't initialized yet
  return updatedTokens.length > 0 ? updatedTokens : initialTokens;
};