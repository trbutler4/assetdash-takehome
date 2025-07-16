import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTokens } from '@/hooks/useTokens';
import { usePriceUpdates } from '@/hooks/usePriceUpdates';
import { useFilters } from '@/hooks/useFilters';
import { useSort } from '@/hooks/useSort';
import { usePaginatedTokens } from '@/hooks/usePaginatedTokens';
import { TokenList } from '@/components/TokenList';
import { FilterPanel } from '@/components/FilterPanel';
import { SortPicker } from '@/components/SortPicker';
import { sortTokens } from '@/utils/sorting';

export default function HomeScreen() {
  const { data: tokens = [], isLoading, error, refetch, isRefetching } = useTokens();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [updateType, setUpdateType] = useState<'manual' | 'auto' | null>(null);
  
  // Handle manual refresh with animation
  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    setUpdateType('manual');
    await refetch();
    setIsManualRefreshing(false);
  };
  
  // Update timestamp when data changes
  useEffect(() => {
    if (tokens.length > 0 && !isLoading) {
      setLastUpdateTime(new Date());
      // If not manual refresh, it's an auto update
      if (!isManualRefreshing && updateType !== 'manual') {
        setUpdateType('auto');
      }
    }
  }, [tokens, isLoading, isManualRefreshing, updateType]);
  
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
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters and sorting to tokens
  const processedTokens = useMemo(() => {
    const filteredTokens = applyFilters(updatedTokens);
    return sortTokens(filteredTokens, sortOption);
  }, [updatedTokens, applyFilters, sortOption]);

  // Paginate the processed tokens
  const {
    paginatedTokens,
    loadMore,
    hasMore,
    isLoadingMore,
    totalCount,
    displayedCount,
  } = usePaginatedTokens(processedTokens);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading tokens</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Token List</Text>
          <TouchableOpacity
            style={[styles.filterToggle, activeFilterCount() > 0 && styles.filterToggleActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text style={styles.filterToggleText}>
              {showFilters ? 'Hide' : 'Show'} Filters
              {activeFilterCount() > 0 && ` (${activeFilterCount()})`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerBottom}>
          <Text style={styles.headerSubtitle}>
            Showing {displayedCount} of {totalCount} ({tokens.length} total)
          </Text>
          {lastUpdateTime && (
            <Text style={styles.updateTime}>
              {updateType === 'manual' ? 'Refreshed' : 'Auto-updated'}: {lastUpdateTime.toLocaleTimeString()}
            </Text>
          )}
        </View>
      </View>
      
      {showFilters && (
        <FilterPanel
          filters={filters}
          onToggleFilter={toggleFilter}
          onUpdatePriceThreshold={updatePriceThreshold}
          onResetFilters={resetFilters}
          activeFilterCount={activeFilterCount()}
        />
      )}
      
      <SortPicker
        currentSort={sortOption}
        onSortChange={updateSortOption}
      />
      
      <TokenList
        tokens={paginatedTokens}
        isLoading={isLoading}
        isRefreshing={isManualRefreshing}
        onRefresh={handleManualRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  filterToggleActive: {
    backgroundColor: '#E3F2FD',
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  updateTime: {
    fontSize: 12,
    color: '#999',
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
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});