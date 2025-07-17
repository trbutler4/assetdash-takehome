import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTokens } from '@/hooks/useTokens';
import { usePriceUpdates } from '@/hooks/usePriceUpdates';
import { useFilters } from '@/hooks/useFilters';
import { useSort } from '@/hooks/useSort';
import { TokenList } from '@/components/TokenList';
import { FilterPanel } from '@/components/FilterPanel';
import { SortPicker } from '@/components/SortPicker';
import { sortTokens } from '@/utils/sorting';
import { UI_CONFIG } from '@/constants/app';

/**
 * Update type for tracking manual vs automatic updates
 */
type UpdateType = 'manual' | 'auto' | null;

/**
 * Props for the ErrorView component
 */
interface ErrorViewProps {
  error: Error;
  onRetry: () => void;
}

/**
 * Error view component
 */
const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>Error loading tokens</Text>
    <Text style={styles.errorMessage}>{error.message}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

/**
 * Props for the HeaderSection component
 */
interface HeaderSectionProps {
  tokenCount: number;
  filteredCount: number;
  lastUpdateTime: Date | null;
  updateType: UpdateType;
  showFilters: boolean;
  activeFilterCount: number;
  onToggleFilters: () => void;
}

/**
 * Header section component
 */
const HeaderSection: React.FC<HeaderSectionProps> = ({
  tokenCount,
  filteredCount,
  lastUpdateTime,
  updateType,
  showFilters,
  activeFilterCount,
  onToggleFilters,
}) => (
  <View style={styles.header}>
    <View style={styles.headerTop}>
      <Text style={styles.headerTitle}>Token List</Text>
      <TouchableOpacity
        style={[styles.filterToggle, activeFilterCount > 0 && styles.filterToggleActive]}
        onPress={onToggleFilters}
      >
        <Text style={styles.filterToggleText}>
          {showFilters ? 'Hide' : 'Show'} Filters
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </Text>
      </TouchableOpacity>
    </View>
    <View style={styles.headerBottom}>
      <Text style={styles.headerSubtitle}>
        {filteredCount} of {tokenCount} tokens
      </Text>
      {lastUpdateTime && (
        <Text style={styles.updateTime}>
          {updateType === 'manual' ? 'Refreshed' : 'Auto-updated'}: {lastUpdateTime.toLocaleTimeString()}
        </Text>
      )}
    </View>
  </View>
);

/**
 * Main screen component displaying the token list with filters and sorting
 */
export default function HomeScreen() {
  // Data fetching hooks
  const { data: tokens = [], isLoading, error, refetch } = useTokens();
  
  // State management
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [updateType, setUpdateType] = useState<UpdateType>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Feature hooks
  const updatedTokens = usePriceUpdates(tokens);
  const { 
    filters, 
    toggleFilter, 
    updatePriceThreshold, 
    resetFilters, 
    applyFilters,
    activeFilterCount 
  } = useFilters();
  const { sortOption, updateSortOption } = useSort();
  
  // Memoize active filter count to prevent recalculation
  const filterCount = useMemo(() => activeFilterCount(), [filters]);

  /**
   * Handle manual refresh action
   */
  const handleManualRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    setUpdateType('manual');
    await refetch();
    setIsManualRefreshing(false);
  }, [refetch]);

  /**
   * Toggle filter panel visibility
   */
  const toggleFilterPanel = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  /**
   * Update timestamp when data changes
   */
  useEffect(() => {
    if (tokens.length > 0 && !isLoading) {
      setLastUpdateTime(new Date());
      // If not manual refresh, it's an auto update
      if (!isManualRefreshing && updateType !== 'manual') {
        setUpdateType('auto');
      }
    }
  }, [tokens, isLoading, isManualRefreshing, updateType]);
  
  /**
   * Apply filters and sorting to tokens
   */
  const processedTokens = useMemo(() => {
    const filteredTokens = applyFilters(updatedTokens);
    return sortTokens(filteredTokens, sortOption);
  }, [updatedTokens, filters, sortOption]); // Use filters directly instead of applyFilters callback

  // Handle error state

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView error={error} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <HeaderSection
        tokenCount={tokens.length}
        filteredCount={processedTokens.length}
        lastUpdateTime={lastUpdateTime}
        updateType={updateType}
        showFilters={showFilters}
        activeFilterCount={filterCount}
        onToggleFilters={toggleFilterPanel}
      />
      
      {showFilters && (
        <FilterPanel
          filters={filters}
          onToggleFilter={toggleFilter}
          onUpdatePriceThreshold={updatePriceThreshold}
          onResetFilters={resetFilters}
          activeFilterCount={filterCount}
        />
      )}
      
      <SortPicker
        currentSort={sortOption}
        onSortChange={updateSortOption}
      />
      
      <TokenList
        tokens={processedTokens}
        isLoading={isLoading}
        isRefreshing={isManualRefreshing}
        onRefresh={handleManualRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
  },
  header: {
    backgroundColor: UI_CONFIG.COLORS.SURFACE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: UI_CONFIG.COLORS.BORDER,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
    borderRadius: 16,
  },
  filterToggleActive: {
    backgroundColor: '#E3F2FD',
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT.SECONDARY,
  },
  updateTime: {
    fontSize: 12,
    color: UI_CONFIG.COLORS.TEXT.TERTIARY,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT.SECONDARY,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    borderRadius: 8,
  },
  retryButtonText: {
    color: UI_CONFIG.COLORS.SURFACE,
    fontSize: 16,
    fontWeight: '600',
  },
});