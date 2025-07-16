import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilterState } from '@/types/token';

const FILTER_STORAGE_KEY = 'token_filter_state';

const DEFAULT_FILTER_STATE: FilterState = {
  is_new: false,
  is_pro: false,
  price_above_threshold: false,
  price_threshold: 0.01, // Default $0.01
};

export const filterStorage = {
  // Save filter state to AsyncStorage
  saveFilters: async (filters: FilterState): Promise<void> => {
    try {
      await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters to AsyncStorage:', error);
      throw error;
    }
  },

  // Load filter state from AsyncStorage
  loadFilters: async (): Promise<FilterState> => {
    try {
      const storedFilters = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
      if (storedFilters !== null) {
        return JSON.parse(storedFilters) as FilterState;
      }
      return DEFAULT_FILTER_STATE;
    } catch (error) {
      console.error('Error loading filters from AsyncStorage:', error);
      return DEFAULT_FILTER_STATE;
    }
  },

  // Clear all filters and reset to default
  clearFilters: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(FILTER_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing filters from AsyncStorage:', error);
      throw error;
    }
  },

  // Get default filter state
  getDefaultFilters: (): FilterState => {
    return { ...DEFAULT_FILTER_STATE };
  },
};