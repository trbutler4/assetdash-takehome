import { useEffect, useState, useCallback, useRef } from 'react';
import { Token } from '@/types/token';

const PRICE_UPDATE_INTERVAL = 10000; // 10 seconds
const MIN_TOKENS_TO_UPDATE = 3;
const MAX_TOKENS_TO_UPDATE = 8;
const MAX_PRICE_CHANGE_PERCENT = 0.15; // Max 15% price change

export const usePriceUpdates = (initialTokens: Token[]) => {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update tokens when initial data changes
  useEffect(() => {
    setTokens(initialTokens);
  }, [initialTokens]);

  const generateRandomPriceChange = () => {
    // Generate a random price change between -15% and +15%
    return (Math.random() - 0.5) * 2 * MAX_PRICE_CHANGE_PERCENT;
  };

  const updateTokenPrice = (token: Token): Token => {
    const priceChangePercent = generateRandomPriceChange();
    const newPrice = token.price_usd * (1 + priceChangePercent);
    const newMarketCap = newPrice * token.total_supply;

    // Update price change percentages (simulate realistic changes)
    const updatedPriceChangePercent = {
      m5: priceChangePercent * 100,
      m30: token.price_change_percent.m30 * 0.9 + priceChangePercent * 10,
      h1: token.price_change_percent.h1 * 0.8 + priceChangePercent * 5,
      h4: token.price_change_percent.h4 * 0.7 + priceChangePercent * 2,
      h8: token.price_change_percent.h8 * 0.6 + priceChangePercent * 1,
      h24: token.price_change_percent.h24 * 0.5 + priceChangePercent * 0.5,
    };

    // Simulate volume changes
    const volumeMultiplier = 1 + Math.random() * 0.3;
    const updatedVolume = {
      m5: token.volume_usd.m5 * volumeMultiplier,
      m30: token.volume_usd.m30 * (0.9 + Math.random() * 0.2),
      h1: token.volume_usd.h1 * (0.95 + Math.random() * 0.1),
      h4: token.volume_usd.h4 * (0.98 + Math.random() * 0.04),
      h8: token.volume_usd.h8 * (0.99 + Math.random() * 0.02),
      h24: token.volume_usd.h24 * (0.995 + Math.random() * 0.01),
    };

    return {
      ...token,
      price_usd: newPrice,
      market_cap_usd: newMarketCap,
      price_change_percent: updatedPriceChangePercent,
      volume_usd: updatedVolume,
    };
  };

  const updateRandomTokens = useCallback(() => {
    setTokens((currentTokens) => {
      if (currentTokens.length === 0) return currentTokens;

      // Determine how many tokens to update
      const tokensToUpdateCount = Math.floor(
        Math.random() * (MAX_TOKENS_TO_UPDATE - MIN_TOKENS_TO_UPDATE + 1) + MIN_TOKENS_TO_UPDATE
      );

      // Create a copy of the tokens array
      const updatedTokens = [...currentTokens];

      // Get random indices to update
      const indicesToUpdate = new Set<number>();
      while (indicesToUpdate.size < Math.min(tokensToUpdateCount, currentTokens.length)) {
        indicesToUpdate.add(Math.floor(Math.random() * currentTokens.length));
      }

      // Update the selected tokens
      indicesToUpdate.forEach((index) => {
        updatedTokens[index] = updateTokenPrice(updatedTokens[index]);
      });

      return updatedTokens;
    });
  }, []);

  // Set up the interval
  useEffect(() => {
    if (initialTokens.length > 0) {
      // Start the interval
      intervalRef.current = setInterval(updateRandomTokens, PRICE_UPDATE_INTERVAL);

      // Cleanup function
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [updateRandomTokens, initialTokens.length]);

  return tokens;
};