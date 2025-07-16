import { Token, SortOption } from '@/types/token';

export const sortTokens = (tokens: Token[], sortOption: SortOption): Token[] => {
  const sortedTokens = [...tokens];

  switch (sortOption) {
    case 'price_asc':
      return sortedTokens.sort((a, b) => {
        if (a.price_usd == null) return 1;
        if (b.price_usd == null) return -1;
        return a.price_usd - b.price_usd;
      });
    
    case 'price_desc':
      return sortedTokens.sort((a, b) => {
        if (b.price_usd == null) return 1;
        if (a.price_usd == null) return -1;
        return b.price_usd - a.price_usd;
      });
    
    case 'market_cap_asc':
      return sortedTokens.sort((a, b) => {
        if (a.market_cap_usd == null) return 1;
        if (b.market_cap_usd == null) return -1;
        return a.market_cap_usd - b.market_cap_usd;
      });
    
    case 'market_cap_desc':
      return sortedTokens.sort((a, b) => {
        if (b.market_cap_usd == null) return 1;
        if (a.market_cap_usd == null) return -1;
        return b.market_cap_usd - a.market_cap_usd;
      });
    
    case 'symbol_asc':
      return sortedTokens.sort((a, b) => {
        if (!a.token_symbol) return 1;
        if (!b.token_symbol) return -1;
        return a.token_symbol.localeCompare(b.token_symbol);
      });
    
    case 'symbol_desc':
      return sortedTokens.sort((a, b) => {
        if (!b.token_symbol) return 1;
        if (!a.token_symbol) return -1;
        return b.token_symbol.localeCompare(a.token_symbol);
      });
    
    case 'volume_desc':
      return sortedTokens.sort((a, b) => {
        if (!b.volume_usd || b.volume_usd.h24 == null) return 1;
        if (!a.volume_usd || a.volume_usd.h24 == null) return -1;
        return b.volume_usd.h24 - a.volume_usd.h24;
      });
    
    default:
      return sortedTokens;
  }
};

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'market_cap_desc', label: 'Market Cap (High to Low)' },
  { value: 'market_cap_asc', label: 'Market Cap (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'volume_desc', label: 'Volume (24h)' },
  { value: 'symbol_asc', label: 'Symbol (A-Z)' },
  { value: 'symbol_desc', label: 'Symbol (Z-A)' },
];

export const getDefaultSortOption = (): SortOption => 'market_cap_desc';