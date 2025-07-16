import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SortOption } from '@/types/token';
import { getDefaultSortOption } from '@/utils/sorting';

const SORT_STORAGE_KEY = 'token_sort_option';

export const useSort = () => {
  const [sortOption, setSortOption] = useState<SortOption>(getDefaultSortOption());
  const [isLoading, setIsLoading] = useState(true);

  // Load sort option from AsyncStorage on mount
  useEffect(() => {
    const loadStoredSort = async () => {
      try {
        setIsLoading(true);
        const storedSort = await AsyncStorage.getItem(SORT_STORAGE_KEY);
        if (storedSort !== null) {
          setSortOption(storedSort as SortOption);
        }
      } catch (error) {
        console.error('Failed to load sort option:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredSort();
  }, []);

  // Save sort option whenever it changes
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(SORT_STORAGE_KEY, sortOption).catch((error) => {
        console.error('Failed to save sort option:', error);
      });
    }
  }, [sortOption, isLoading]);

  // Update sort option
  const updateSortOption = useCallback((newSortOption: SortOption) => {
    setSortOption(newSortOption);
  }, []);

  // Reset to default sort option
  const resetSort = useCallback(async () => {
    const defaultSort = getDefaultSortOption();
    setSortOption(defaultSort);
    try {
      await AsyncStorage.removeItem(SORT_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset sort option:', error);
    }
  }, []);

  return {
    sortOption,
    isLoading,
    updateSortOption,
    resetSort,
  };
};