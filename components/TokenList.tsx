import React, { useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { Token } from '@/types/token';
import { TokenItem } from './TokenItem';
import { UI_CONFIG } from '@/constants/app';

interface TokenListProps {
  tokens: Token[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
}

/**
 * Constants for list item layout calculations
 */
const ITEM_HEIGHT = 73; // Height of item + separator

/**
 * Optimized token list component with virtualization
 * Displays a scrollable list of tokens with pull-to-refresh
 */
export const TokenList: React.FC<TokenListProps> = ({
  tokens,
  isLoading,
  isRefreshing,
  onRefresh,
}) => {
  /**
   * Render individual token item
   */
  const renderToken: ListRenderItem<Token> = useCallback(({ item }) => {
    return <TokenItem item={item} />;
  }, []);

  /**
   * Extract unique key for each token
   */
  const keyExtractor = useCallback((item: Token) => item.token_address, []);

  /**
   * Calculate item layout for better scroll performance
   */
  const getItemLayout = useCallback(
    (_data: ArrayLike<Token> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  /**
   * Render separator between items
   */
  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  /**
   * Render empty state when no tokens
   */
  const renderEmptyComponent = useCallback(() => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tokens found</Text>
        <Text style={styles.emptySubtext}>
          Try adjusting your filters or refresh to load new data
        </Text>
      </View>
    );
  }, [isLoading]);

  // Show loading state only on initial load
  if (isLoading && tokens.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={UI_CONFIG.COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading tokens...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tokens}
        renderItem={renderToken}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContainer,
          tokens.length === 0 && styles.emptyListContainer,
        ]}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            tintColor={UI_CONFIG.COLORS.PRIMARY}
            title="Pull to refresh"
            titleColor={UI_CONFIG.COLORS.PRIMARY}
          />
        }
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={UI_CONFIG.LIST.MAX_TO_RENDER_PER_BATCH}
        windowSize={UI_CONFIG.LIST.WINDOW_SIZE}
        initialNumToRender={UI_CONFIG.LIST.INITIAL_NUM_TO_RENDER}
        updateCellsBatchingPeriod={UI_CONFIG.LIST.UPDATE_CELL_BATCH_SIZE}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT.SECONDARY,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyListContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: UI_CONFIG.COLORS.BORDER,
    marginHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.TEXT.PRIMARY,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT.SECONDARY,
    textAlign: 'center',
  },
});