import { useState, useEffect, useCallback } from 'react';
import { FilterState, Token, BooleanFilterKey } from '@/types/token';
import { filterStorage } from '@/utils/filterStorage';

/**
 * Hook to manage token list filters with persistent storage
 * @returns Filter state and control functions
 */
export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>(filterStorage.getDefaultFilters());
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load filters from AsyncStorage on mount
   */
  useEffect(() => {
    const loadStoredFilters = async () => {
      try {
        setIsLoading(true);
        const storedFilters = await filterStorage.loadFilters();
        setFilters(storedFilters);
      } catch (error) {
        console.error('Failed to load filters:', error);
        // Continue with default filters on error
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredFilters();
  }, []);

  /**
   * Save filters to storage whenever they change
   */
  useEffect(() => {
    if (!isLoading) {
      filterStorage.saveFilters(filters).catch((error) => {
        console.error('Failed to save filters:', error);
        // Non-critical error, user can continue
      });
    }
  }, [filters, isLoading]);

  /**
   * Toggle boolean filter values
   */
  const toggleFilter = useCallback((filterKey: BooleanFilterKey) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  }, []);

  /**
   * Update the price threshold value
   */
  const updatePriceThreshold = useCallback((threshold: number) => {
    // Ensure threshold is non-negative
    const validThreshold = Math.max(0, threshold);
    setFilters((prev) => ({
      ...prev,
      price_threshold: validThreshold,
    }));
  }, []);

  /**
   * Reset all filters to default values
   */
  const resetFilters = useCallback(async () => {
    const defaultFilters = filterStorage.getDefaultFilters();
    setFilters(defaultFilters);
    
    try {
      await filterStorage.clearFilters();
    } catch (error) {
      console.error('Failed to clear stored filters:', error);
      // Filter state is already reset locally
    }
  }, []);

  /**
   * Apply active filters to a token list
   * @param tokens - Array of tokens to filter
   * @returns Filtered array of tokens
   */
  const applyFilters = useCallback((tokens: Token[]): Token[] => {
    return tokens.filter((token) => {
      // Skip tokens with null prices to avoid errors
      if (token.price_usd == null) {
        return false;
      }

      // Apply is_new filter
      if (filters.is_new && !token.is_new) {
        return false;
      }

      // Apply is_pro filter
      if (filters.is_pro && !token.is_pro) {
        return false;
      }

      // Apply price threshold filter
      if (filters.price_above_threshold && token.price_usd < filters.price_threshold) {
        return false;
      }

      return true;
    });
  }, [filters]);

  /**
   * Get the number of active filters
   * @returns Count of filters that are currently active
   */
  const activeFilterCount = useCallback(() => {
    const activeFilters = [
      filters.is_new,
      filters.is_pro,
      filters.price_above_threshold,
    ];
    
    return activeFilters.filter(Boolean).length;
  }, [filters]);

  return {
    filters,
    isLoading,
    toggleFilter,
    updatePriceThreshold,
    resetFilters,
    applyFilters,
    activeFilterCount,
  };
};