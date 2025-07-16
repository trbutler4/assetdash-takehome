import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Token } from '@/types/token';
import { TokenIcon } from './TokenIcon';

interface TokenItemProps {
  item: Token;
}

export const TokenItem = React.memo<TokenItemProps>(({ item }) => {
  const priceChange = item.price_change_percent?.h24 ?? 0;
  const priceChangeColor = priceChange >= 0 ? '#4CAF50' : '#F44336';
  
  return (
    <View style={styles.tokenItem}>
      <View style={styles.tokenLeft}>
        <TokenIcon iconUrl={item.token_icon} />
        <View style={styles.tokenInfo}>
          <Text style={styles.tokenSymbol}>{item.token_symbol || 'UNKNOWN'}</Text>
          <Text style={styles.tokenPrice}>
            ${item.price_usd != null ? item.price_usd.toFixed(6) : '0.000000'}
          </Text>
        </View>
      </View>
      
      <View style={styles.tokenRight}>
        <Text style={styles.marketCap}>
          ${item.market_cap_usd != null ? (item.market_cap_usd / 1000000).toFixed(2) : '0.00'}M
        </Text>
        <Text style={[styles.priceChange, { color: priceChangeColor }]}>
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  // Only re-render if these specific fields change
  // Note: imageError is internal state and doesn't affect this comparison
  return (
    prevProps.item.token_address === nextProps.item.token_address &&
    prevProps.item.price_usd === nextProps.item.price_usd &&
    prevProps.item.market_cap_usd === nextProps.item.market_cap_usd &&
    prevProps.item.price_change_percent?.h24 === nextProps.item.price_change_percent?.h24 &&
    prevProps.item.token_symbol === nextProps.item.token_symbol &&
    prevProps.item.token_icon === nextProps.item.token_icon
  );
});

TokenItem.displayName = 'TokenItem';

const styles = StyleSheet.create({
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
});