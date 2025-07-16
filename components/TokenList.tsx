import React, { useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Token } from '@/types/token';
import { TokenItem } from './TokenItem';

interface TokenListProps {
  tokens: Token[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const TokenList: React.FC<TokenListProps> = ({
  tokens,
  isLoading,
  isRefreshing,
  onRefresh,
}) => {
  const renderToken = useCallback(({ item }: { item: Token }) => {
    return <TokenItem item={item} />;
  }, []);

  const keyExtractor = useCallback((item: Token) => item.token_address, []);

  const getItemLayout = useCallback((data: Token[] | null | undefined, index: number) => ({
    length: 73, // height of item + separator
    offset: 73 * index,
    index,
  }), []);

  if (isLoading && tokens.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tokens}
        renderItem={renderToken}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            tintColor="#007AFF"
            title="Pull to refresh"
            titleColor="#007AFF"
          />
        }
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={15}
        updateCellsBatchingPeriod={50}
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
  listContainer: {
    paddingVertical: 8,
  },

  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
});