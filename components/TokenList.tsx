import React from 'react';
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
  const renderToken = ({ item }: { item: Token }) => {
    const priceChangeColor = item.price_change_percent.h24 >= 0 ? '#4CAF50' : '#F44336';
    
    return (
      <View style={styles.tokenItem}>
        <View style={styles.tokenLeft}>
          <Image source={{ uri: item.token_icon }} style={styles.tokenIcon} />
          <View style={styles.tokenInfo}>
            <Text style={styles.tokenSymbol}>{item.token_symbol}</Text>
            <Text style={styles.tokenPrice}>${item.price_usd.toFixed(6)}</Text>
          </View>
        </View>
        
        <View style={styles.tokenRight}>
          <Text style={styles.marketCap}>
            ${(item.market_cap_usd / 1000000).toFixed(2)}M
          </Text>
          <Text style={[styles.priceChange, { color: priceChangeColor }]}>
            {item.price_change_percent.h24 >= 0 ? '+' : ''}{item.price_change_percent.h24.toFixed(2)}%
          </Text>
        </View>
      </View>
    );
  };

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
          keyExtractor={(item) => item.token_address}
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
  tokenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tokenPrice: {
    fontSize: 14,
    color: '#666',
  },
  tokenRight: {
    alignItems: 'flex-end',
  },
  marketCap: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
});