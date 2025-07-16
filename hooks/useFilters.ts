import { useState, useEffect, useCallback } from 'react';
import { FilterState, Token } from '@/types/token';
import { filterStorage } from '@/utils/filterStorage';

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>(filterStorage.getDefaultFilters());
  const [isLoading, setIsLoading] = useState(true);

  // Load filters from AsyncStorage on mount
  useEffect(() => {
    const loadStoredFilters = async () => {
      try {
        setIsLoading(true);
        const storedFilters = await filterStorage.loadFilters();
        setFilters(storedFilters);
      } catch (error) {
        console.error('Failed to load filters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredFilters();
  }, []);

  // Save filters whenever they change
  useEffect(() => {
    if (!isLoading) {
      filterStorage.saveFilters(filters).catch((error) => {
        console.error('Failed to save filters:', error);
      });
    }
  }, [filters, isLoading]);

  // Toggle boolean filters
  const toggleFilter = useCallback((filterKey: 'is_new' | 'is_pro' | 'price_above_threshold') => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  }, []);

  // Update price threshold
  const updatePriceThreshold = useCallback((threshold: number) => {
    setFilters((prev) => ({
      ...prev,
      price_threshold: threshold,
    }));
  }, []);

  // Reset all filters to default
  const resetFilters = useCallback(async () => {
    const defaultFilters = filterStorage.getDefaultFilters();
    setFilters(defaultFilters);
    await filterStorage.clearFilters();
  }, []);

  // Apply filters to token list
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

  // Get active filter count
  const activeFilterCount = useCallback(() => {
    let count = 0;
    if (filters.is_new) count++;
    if (filters.is_pro) count++;
    if (filters.price_above_threshold) count++;
    return count;
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