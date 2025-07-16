import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FilterState } from '@/types/token';

interface FilterPanelProps {
  filters: FilterState;
  onToggleFilter: (filterKey: 'is_new' | 'is_pro' | 'price_above_threshold') => void;
  onUpdatePriceThreshold: (threshold: number) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onToggleFilter,
  onUpdatePriceThreshold,
  onResetFilters,
  activeFilterCount,
}) => {
  const handlePriceThresholdChange = (text: string) => {
    const value = parseFloat(text);
    if (!isNaN(value) && value >= 0) {
      onUpdatePriceThreshold(value);
    }
  };

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
        {/* New Tokens Filter */}
        <View style={styles.filterItem}>
          <View style={styles.filterInfo}>
            <Text style={styles.filterLabel}>New Tokens</Text>
            <Text style={styles.filterDescription}>Show only newly created tokens</Text>
          </View>
          <Switch
            value={filters.is_new}
            onValueChange={() => onToggleFilter('is_new')}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
            thumbColor={filters.is_new ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Pro Tokens Filter */}
        <View style={styles.filterItem}>
          <View style={styles.filterInfo}>
            <Text style={styles.filterLabel}>Pro Tokens</Text>
            <Text style={styles.filterDescription}>Show only verified pro tokens</Text>
          </View>
          <Switch
            value={filters.is_pro}
            onValueChange={() => onToggleFilter('is_pro')}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
            thumbColor={filters.is_pro ? '#fff' : '#f4f3f4'}
          />
        </View>

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
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
            thumbColor={filters.price_above_threshold ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Price Threshold Input */}
        {filters.price_above_threshold && (
          <View style={styles.thresholdInputContainer}>
            <Text style={styles.thresholdInputLabel}>Price Threshold ($)</Text>
            <TextInput
              style={styles.thresholdInput}
              value={filters.price_threshold.toString()}
              onChangeText={handlePriceThresholdChange}
              keyboardType="decimal-pad"
              placeholder="0.01"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    color: '#007AFF',
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
    color: '#666',
  },
  thresholdInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
  },
  thresholdInputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  thresholdInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
});