import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SortOption } from '@/types/token';
import { getDefaultSortOption, isValidSortOption } from '@/utils/sorting';
import { STORAGE_KEYS } from '@/constants/app';

/**
 * Hook to manage sort option state with persistent storage
 * @returns Sort option state and control functions
 */

export const useSort = () => {
  const [sortOption, setSortOption] = useState<SortOption>(getDefaultSortOption());
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load sort option from AsyncStorage on mount
   */
  useEffect(() => {
    const loadStoredSort = async () => {
      try {
        setIsLoading(true);
        const storedSort = await AsyncStorage.getItem(STORAGE_KEYS.SORT_OPTION);
        if (storedSort !== null && isValidSortOption(storedSort)) {
          setSortOption(storedSort as SortOption);
        } else if (storedSort !== null) {
          // Invalid stored value, clear it
          console.warn(`Invalid sort option stored: ${storedSort}, using default`);
          await AsyncStorage.removeItem(STORAGE_KEYS.SORT_OPTION);
        }
      } catch (error) {
        console.error('Failed to load sort option:', error);
        // Continue with default sort option
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredSort();
  }, []);

  /**
   * Save sort option to storage whenever it changes
   */
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.SORT_OPTION, sortOption).catch((error) => {
        console.error('Failed to save sort option:', error);
        // Non-critical error, user can continue
      });
    }
  }, [sortOption, isLoading]);

  /**
   * Update the current sort option
   * @param newSortOption - The new sort option to apply
   */
  const updateSortOption = useCallback((newSortOption: SortOption) => {
    if (isValidSortOption(newSortOption)) {
      setSortOption(newSortOption);
    } else {
      console.error(`Invalid sort option: ${newSortOption}`);
    }
  }, []);

  /**
   * Reset to default sort option and clear stored preference
   */
  const resetSort = useCallback(async () => {
    const defaultSort = getDefaultSortOption();
    setSortOption(defaultSort);
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SORT_OPTION);
    } catch (error) {
      console.error('Failed to reset sort option:', error);
      // Sort state is already reset locally
    }
  }, []);

  return {
    sortOption,
    isLoading,
    updateSortOption,
    resetSort,
  };
};