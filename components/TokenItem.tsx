import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Token } from '@/types/token';
import { TokenIcon } from './TokenIcon';
import { UI_CONFIG, FORMAT_CONFIG } from '@/constants/app';

interface TokenItemProps {
  item: Token;
}

/**
 * Formats a price value with the configured decimal places
 */
const formatPrice = (price: number | null): string => {
  if (price == null) return `0.${'0'.repeat(FORMAT_CONFIG.PRICE.DECIMAL_PLACES)}`;
  return price.toFixed(FORMAT_CONFIG.PRICE.DECIMAL_PLACES);
};

/**
 * Formats market cap in millions with the configured decimal places
 */
const formatMarketCap = (marketCap: number | null): string => {
  if (marketCap == null) return '0.00M';
  const millions = marketCap / FORMAT_CONFIG.MARKET_CAP.DIVISOR;
  return `${millions.toFixed(FORMAT_CONFIG.MARKET_CAP.DECIMAL_PLACES)}M`;
};

/**
 * Formats percentage change with proper sign and decimal places
 */
const formatPercentage = (percentage: number): string => {
  const formatted = percentage.toFixed(FORMAT_CONFIG.PERCENTAGE.DECIMAL_PLACES);
  return percentage >= 0 ? `+${formatted}%` : `${formatted}%`;
};

/**
 * Individual token list item component
 * Displays token symbol, price, market cap, and 24h price change
 */
export const TokenItem = React.memo<TokenItemProps>(({ item }) => {
  // Calculate values directly - React.memo handles memoization
  const priceChange = item.price_change_percent?.h24 ?? 0;
  const priceChangeColor = priceChange >= 0 ? UI_CONFIG.COLORS.POSITIVE : UI_CONFIG.COLORS.NEGATIVE;
  
  return (
    <View style={styles.tokenItem}>
      <View style={styles.tokenLeft}>
        <TokenIcon iconUrl={item.token_icon} />
        <View style={styles.tokenInfo}>
          <Text style={styles.tokenSymbol}>{item.token_symbol || 'UNKNOWN'}</Text>
          <Text style={styles.tokenPrice}>
            ${formatPrice(item.price_usd)}
          </Text>
        </View>
      </View>
      
      <View style={styles.tokenRight}>
        <Text style={styles.marketCap}>
          ${formatMarketCap(item.market_cap_usd)}
        </Text>
        <Text style={[styles.priceChange, { color: priceChangeColor }]}>
          {formatPercentage(priceChange)}
        </Text>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Optimized comparison - only check fields that affect visual display
  const prev = prevProps.item;
  const next = nextProps.item;
  
  if (prev.token_address !== next.token_address) return false;
  if (prev.token_symbol !== next.token_symbol) return false;
  if (prev.token_icon !== next.token_icon) return false;
  
  // For numeric values, use a small threshold to prevent unnecessary re-renders
  const priceThreshold = 0.000001;
  if (Math.abs((prev.price_usd ?? 0) - (next.price_usd ?? 0)) > priceThreshold) return false;
  if (Math.abs((prev.market_cap_usd ?? 0) - (next.market_cap_usd ?? 0)) > priceThreshold) return false;
  
  const changeThreshold = 0.01;
  if (Math.abs((prev.price_change_percent?.h24 ?? 0) - (next.price_change_percent?.h24 ?? 0)) > changeThreshold) return false;
  
  return true;
});

TokenItem.displayName = 'TokenItem';

const styles = StyleSheet.create({
  tokenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: UI_CONFIG.COLORS.SURFACE,
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
    color: UI_CONFIG.COLORS.TEXT.SECONDARY,
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