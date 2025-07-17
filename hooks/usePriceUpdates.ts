import { useEffect, useState, useCallback, useRef } from "react";
import { Token, TimeSeriesData } from "@/types/token";
import { PRICE_UPDATE_CONFIG } from "@/constants/app";

/**
 * Hook to simulate price updates for tokens at regular intervals
 * @param initialTokens - The initial array of tokens to update
 * @returns Array of tokens with updated prices
 */
export const usePriceUpdates = (initialTokens: Token[]) => {
  const [updatedTokens, setUpdatedTokens] = useState<Token[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Generates a random price change percentage within configured limits
   */
  const generateRandomPriceChange = useCallback(() => {
    // Generate a random price change between -MAX% and +MAX%
    return (Math.random() - 0.5) * 2 * PRICE_UPDATE_CONFIG.MAX_PRICE_CHANGE_PERCENT;
  }, []);

  /**
   * Updates price change percentages with time decay
   */
  const updatePriceChangePercent = useCallback(
    (currentPercent: TimeSeriesData | null, priceChangePercent: number): TimeSeriesData | null => {
      if (!currentPercent) return currentPercent;
      
      const { TIME_DECAY_FACTORS } = PRICE_UPDATE_CONFIG;
      
      return {
        m5: priceChangePercent * 100,
        m30: (currentPercent.m30 ?? 0) * TIME_DECAY_FACTORS.M30 + priceChangePercent * 10,
        h1: (currentPercent.h1 ?? 0) * TIME_DECAY_FACTORS.H1 + priceChangePercent * 5,
        h4: (currentPercent.h4 ?? 0) * TIME_DECAY_FACTORS.H4 + priceChangePercent * 2,
        h8: (currentPercent.h8 ?? 0) * TIME_DECAY_FACTORS.H8 + priceChangePercent * 1,
        h24: (currentPercent.h24 ?? 0) * TIME_DECAY_FACTORS.H24 + priceChangePercent * 0.5,
      };
    },
    []
  );

  /**
   * Updates volume with random multiplier
   */
  const updateVolume = useCallback(
    (currentVolume: TimeSeriesData | null): TimeSeriesData | null => {
      if (!currentVolume) return currentVolume;
      
      const { VOLUME_MULTIPLIER } = PRICE_UPDATE_CONFIG;
      const baseMultiplier = VOLUME_MULTIPLIER.MIN + Math.random() * (VOLUME_MULTIPLIER.MAX - VOLUME_MULTIPLIER.MIN);
      
      return {
        m5: (currentVolume.m5 ?? 0) * baseMultiplier,
        m30: (currentVolume.m30 ?? 0) * (0.9 + Math.random() * 0.2),
        h1: (currentVolume.h1 ?? 0) * (0.95 + Math.random() * 0.1),
        h4: (currentVolume.h4 ?? 0) * (0.98 + Math.random() * 0.04),
        h8: (currentVolume.h8 ?? 0) * (0.99 + Math.random() * 0.02),
        h24: (currentVolume.h24 ?? 0) * (0.995 + Math.random() * 0.01),
      };
    },
    []
  );

  /**
   * Updates a single token's price and related fields
   */
  const updateTokenPrice = useCallback(
    (token: Token): Token => {
      // Skip tokens with null prices
      if (token.price_usd == null) {
        return token;
      }

      const priceChangePercent = generateRandomPriceChange();
      const newPrice = token.price_usd * (1 + priceChangePercent);
      const newMarketCap = token.total_supply != null
        ? newPrice * token.total_supply
        : token.market_cap_usd;

      return {
        ...token,
        price_usd: newPrice,
        market_cap_usd: newMarketCap,
        price_change_percent: updatePriceChangePercent(token.price_change_percent, priceChangePercent),
        volume_usd: updateVolume(token.volume_usd),
      };
    },
    [generateRandomPriceChange, updatePriceChangePercent, updateVolume]
  );

  /**
   * Gets random indices for tokens to update
   */
  const getRandomIndicesToUpdate = useCallback((tokenCount: number): Set<number> => {
    const { MIN_TOKENS_TO_UPDATE, MAX_TOKENS_TO_UPDATE } = PRICE_UPDATE_CONFIG;
    
    const tokensToUpdateCount = Math.min(
      Math.floor(
        Math.random() * (MAX_TOKENS_TO_UPDATE - MIN_TOKENS_TO_UPDATE + 1) + MIN_TOKENS_TO_UPDATE
      ),
      tokenCount
    );

    const indices = new Set<number>();
    while (indices.size < tokensToUpdateCount) {
      indices.add(Math.floor(Math.random() * tokenCount));
    }
    
    return indices;
  }, []);

  /**
   * Updates a random selection of tokens with new prices
   */
  const updateRandomTokens = useCallback(
    (tokens: Token[]) => {
      if (tokens.length === 0) return tokens;

      const indicesToUpdate = getRandomIndicesToUpdate(tokens.length);
      
      // Only create new array if we have tokens to update
      if (indicesToUpdate.size === 0) return tokens;

      // Create new array with minimal changes
      return tokens.map((token, index) => {
        if (indicesToUpdate.has(index)) {
          return updateTokenPrice(token);
        }
        return token; // Keep reference to unchanged token
      });
    },
    [getRandomIndicesToUpdate, updateTokenPrice]
  );

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
        setUpdatedTokens((currentTokens) => {
          const newTokens = updateRandomTokens(currentTokens);
          // Only update state if tokens actually changed
          return newTokens === currentTokens ? currentTokens : newTokens;
        });
      };

      // Start the interval
      intervalRef.current = setInterval(updatePrices, PRICE_UPDATE_CONFIG.INTERVAL_MS);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateRandomTokens, updatedTokens.length]);

  // Return the original tokens if we haven't initialized yet
  return updatedTokens.length > 0 ? updatedTokens : initialTokens;
};
