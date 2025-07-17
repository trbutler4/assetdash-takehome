import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import { FilterState, BooleanFilterKey } from '@/types/token';
import { UI_CONFIG } from '@/constants/app';

interface FilterPanelProps {
  filters: FilterState;
  onToggleFilter: (filterKey: BooleanFilterKey) => void;
  onUpdatePriceThreshold: (threshold: number) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

/**
 * Filter configuration for UI display
 */
interface FilterConfig {
  key: BooleanFilterKey;
  label: string;
  description: string;
}

/**
 * Available filter configurations
 */
const FILTER_CONFIGS: FilterConfig[] = [
  {
    key: 'is_new',
    label: 'New Tokens',
    description: 'Show only newly created tokens',
  },
  {
    key: 'is_pro',
    label: 'Pro Tokens',
    description: 'Show only verified pro tokens',
  },
];

/**
 * Filter panel component for managing token list filters
 * Displays toggleable filters and price threshold input
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onToggleFilter,
  onUpdatePriceThreshold,
  onResetFilters,
  activeFilterCount,
}) => {
  const [priceInputValue, setPriceInputValue] = React.useState(filters.price_threshold.toString());
  const [isInputFocused, setIsInputFocused] = React.useState(false);

  React.useEffect(() => {
    // Only update the input value from filters when not focused
    if (!isInputFocused) {
      setPriceInputValue(filters.price_threshold.toString());
    }
  }, [filters.price_threshold, isInputFocused]);

  /**
   * Handle price threshold input changes
   */
  const handlePriceThresholdChange = useCallback((text: string) => {
    // Allow typing decimal points and numbers
    setPriceInputValue(text);
    
    // Update the actual filter only if it's a valid number
    const value = parseFloat(text);
    if (!isNaN(value) && value >= 0) {
      onUpdatePriceThreshold(value);
    }
  }, [onUpdatePriceThreshold]);

  /**
   * Handle price input focus
   */
  const handlePriceThresholdFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  /**
   * Handle price input blur - validate and update final value
   */
  const handlePriceThresholdBlur = useCallback(() => {
    setIsInputFocused(false);
    // On blur, ensure we have a valid number
    const value = parseFloat(priceInputValue);
    if (isNaN(value) || value < 0) {
      setPriceInputValue(filters.price_threshold.toString());
    } else {
      // Update the filter with the final value
      onUpdatePriceThreshold(value);
    }
  }, [priceInputValue, filters.price_threshold, onUpdatePriceThreshold]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        {activeFilterCount > 0 && (
          <TouchableOpacity onPress={onResetFilters} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset ({activeFilterCount})</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.filterList}>
        {/* Render configured filters */}
        {FILTER_CONFIGS.map((config) => (
          <View key={config.key} style={styles.filterItem}>
            <View style={styles.filterInfo}>
              <Text style={styles.filterLabel}>{config.label}</Text>
              <Text style={styles.filterDescription}>{config.description}</Text>
            </View>
            <Switch
              value={filters[config.key]}
              onValueChange={() => onToggleFilter(config.key)}
              trackColor={{ false: UI_CONFIG.COLORS.BORDER, true: UI_CONFIG.COLORS.POSITIVE }}
              thumbColor={filters[config.key] ? UI_CONFIG.COLORS.SURFACE : '#f4f3f4'}
            />
          </View>
        ))}

        {/* Price Threshold Filter */}
        <View style={styles.filterItem}>
          <View style={styles.filterInfo}>
            <Text style={styles.filterLabel}>Minimum Price</Text>
            <Text style={styles.filterDescription}>
              Show tokens above ${filters.price_threshold.toFixed(4)}
            </Text>
          </View>
          <Switch
            value={filters.price_above_threshold}
            onValueChange={() => onToggleFilter('price_above_threshold')}
            trackColor={{ false: UI_CONFIG.COLORS.BORDER, true: UI_CONFIG.COLORS.POSITIVE }}
            thumbColor={filters.price_above_threshold ? UI_CONFIG.COLORS.SURFACE : '#f4f3f4'}
          />
        </View>

        {/* Price Threshold Input */}
        {filters.price_above_threshold && (
          <View style={styles.thresholdInputContainer}>
            <Text style={styles.thresholdInputLabel}>Price Threshold ($)</Text>
            <View style={styles.thresholdInputRow}>
              <TextInput
                style={styles.thresholdInput}
                value={priceInputValue}
                onChangeText={handlePriceThresholdChange}
                onFocus={handlePriceThresholdFocus}
                onBlur={handlePriceThresholdBlur}
                keyboardType="numeric"
                placeholder="0.01"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              <TouchableOpacity 
                style={styles.doneButton} 
                onPress={Keyboard.dismiss}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: UI_CONFIG.COLORS.SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: UI_CONFIG.COLORS.BORDER,
    maxHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  resetButtonText: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.PRIMARY,
    fontWeight: '500',
  },
  filterList: {
    paddingVertical: 8,
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterInfo: {
    flex: 1,
    marginRight: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  filterDescription: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT.SECONDARY,
  },
  thresholdInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
  },
  thresholdInputLabel: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT.SECONDARY,
    marginBottom: 8,
  },
  thresholdInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thresholdInput: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.SURFACE,
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.BORDER,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
  },
  doneButton: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  doneButtonText: {
    color: UI_CONFIG.COLORS.SURFACE,
    fontSize: 16,
    fontWeight: '600',
  },
});