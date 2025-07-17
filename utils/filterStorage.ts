import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilterState } from '@/types/token';
import { STORAGE_KEYS, DEFAULT_VALUES } from '@/constants/app';

/**
 * Storage error class for filter operations
 */
class FilterStorageError extends Error {
  constructor(
    message: string,
    public operation: 'save' | 'load' | 'clear',
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'FilterStorageError';
  }
}

/**
 * Service for managing filter state persistence
 */
export const filterStorage = {
  /**
   * Save filter state to AsyncStorage
   * @param filters - The filter state to save
   * @throws {FilterStorageError} When save operation fails
   */
  saveFilters: async (filters: FilterState): Promise<void> => {
    try {
      const serializedFilters = JSON.stringify(filters);
      await AsyncStorage.setItem(STORAGE_KEYS.FILTER_STATE, serializedFilters);
    } catch (error) {
      console.error('Error saving filters to AsyncStorage:', error);
      throw new FilterStorageError(
        'Failed to save filter preferences',
        'save',
        error
      );
    }
  },

  /**
   * Load filter state from AsyncStorage
   * @returns The stored filter state or default values if not found
   * @throws {FilterStorageError} When parsing stored data fails
   */
  loadFilters: async (): Promise<FilterState> => {
    try {
      const storedFilters = await AsyncStorage.getItem(STORAGE_KEYS.FILTER_STATE);
      
      if (storedFilters === null) {
        return filterStorage.getDefaultFilters();
      }

      try {
        const parsedFilters = JSON.parse(storedFilters) as FilterState;
        // Validate the loaded filter structure
        return filterStorage.validateFilterState(parsedFilters);
      } catch (parseError) {
        console.error('Error parsing stored filters:', parseError);
        throw new FilterStorageError(
          'Stored filter data is corrupted',
          'load',
          parseError
        );
      }
    } catch (error) {
      // AsyncStorage errors (e.g., permission issues)
      console.error('Error accessing AsyncStorage:', error);
      // Return defaults for non-parsing errors to allow app to continue
      if (!(error instanceof FilterStorageError)) {
        return filterStorage.getDefaultFilters();
      }
      throw error;
    }
  },

  /**
   * Clear all filters and reset to default
   * @throws {FilterStorageError} When clear operation fails
   */
  clearFilters: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FILTER_STATE);
    } catch (error) {
      console.error('Error clearing filters from AsyncStorage:', error);
      throw new FilterStorageError(
        'Failed to clear filter preferences',
        'clear',
        error
      );
    }
  },

  /**
   * Get default filter state
   * @returns A copy of the default filter state
   */
  getDefaultFilters: (): FilterState => {
    return { ...DEFAULT_VALUES.FILTER_STATE };
  },

  /**
   * Validate and ensure filter state has all required properties
   * @param filters - Filter state to validate
   * @returns Valid filter state with defaults for missing properties
   */
  validateFilterState: (filters: Partial<FilterState>): FilterState => {
    const defaults = filterStorage.getDefaultFilters();
    
    return {
      is_new: filters.is_new ?? defaults.is_new,
      is_pro: filters.is_pro ?? defaults.is_pro,
      price_above_threshold: filters.price_above_threshold ?? defaults.price_above_threshold,
      price_threshold: filters.price_threshold ?? defaults.price_threshold,
    };
  },
};