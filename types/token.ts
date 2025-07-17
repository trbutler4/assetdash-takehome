/**
 * Time series data for various metrics across different time intervals
 */
export interface TimeSeriesData {
  /** 5 minute interval */
  m5: number;
  /** 30 minute interval */
  m30: number;
  /** 1 hour interval */
  h1: number;
  /** 4 hour interval */
  h4: number;
  /** 8 hour interval */
  h8: number;
  /** 24 hour interval */
  h24: number;
}

/**
 * Token data structure from the API
 */
export interface Token {
  /** Unique blockchain address of the token */
  token_address: string;
  /** Trading symbol of the token */
  token_symbol: string;
  /** URL of the token icon/logo */
  token_icon: string;
  /** Token creation timestamp */
  token_created: number;
  /** Current price in USD */
  price_usd: number | null;
  /** Market capitalization in USD */
  market_cap_usd: number | null;
  /** Total token supply */
  total_supply: number | null;
  /** Price change percentages across time intervals */
  price_change_percent: TimeSeriesData | null;
  /** Number of whale holders across time intervals */
  whale_count: TimeSeriesData;
  /** Number of whale trades across time intervals */
  whale_trades_count: TimeSeriesData;
  /** Number of whale buy transactions */
  whale_buys_count: TimeSeriesData;
  /** Volume of whale buys in USD */
  whale_buy_volume_usd: TimeSeriesData;
  /** Number of whale sell transactions */
  whale_sells_count: TimeSeriesData;
  /** Volume of whale sells in USD */
  whale_sell_volume_usd: TimeSeriesData;
  /** Net whale flow in USD (buys - sells) */
  whale_net_flow_usd: TimeSeriesData;
  /** Amount of tokens bought by whales */
  whale_buy_amount: TimeSeriesData;
  /** Amount of tokens sold by whales */
  whale_sell_amount: TimeSeriesData;
  /** Net whale token amount (buys - sells) */
  whale_net_amount: TimeSeriesData;
  /** Percentage of whales that retained their holdings */
  whale_holder_retention_percent: TimeSeriesData;
  /** Percentage of supply bought by whales */
  whale_buy_supply_percent: TimeSeriesData;
  /** Percentage of supply sold by whales */
  whale_sell_supply_percent: TimeSeriesData;
  /** Net percentage of supply held by whales */
  whale_net_supply_percent: TimeSeriesData;
  /** Trading volume in USD across time intervals */
  volume_usd: TimeSeriesData | null;
  /** Current liquidity in USD */
  liquidity_usd: number | null;
  /** Number of transactions across time intervals */
  transactions_count: TimeSeriesData;
  /** Whether the token is newly created */
  is_new: boolean;
  /** Whether the token is from pump.fun */
  is_pump: boolean;
  /** Whether the token is verified as pro */
  is_pro: boolean;
  /** Whether the token is on Bonk platform */
  is_bonk: boolean;
  /** Whether the token is on Believe platform */
  is_believe: boolean;
  /** Whether the token is on xStocks platform */
  is_xstocks: boolean | null;
  /** Whether the token is on Raydium */
  is_ray: boolean;
  /** Anti-rug score (0-100, higher is safer) */
  antirug_score: number | null;
  /** Launchpad platform name */
  launchpad: string | null;
  /** Scoring values across time intervals */
  score_values: TimeSeriesData;
}

export type TokenList = Token[];

/**
 * Available filter types
 */
export type BooleanFilterKey = 'is_new' | 'is_pro' | 'price_above_threshold';
export type NumericFilterKey = 'price_threshold';
export type FilterKey = BooleanFilterKey | NumericFilterKey;

/**
 * Filter state for token list
 */
export interface FilterState {
  /** Show only new tokens */
  is_new: boolean;
  /** Show only pro/verified tokens */
  is_pro: boolean;
  /** Enable price threshold filter */
  price_above_threshold: boolean;
  /** Minimum price threshold in USD */
  price_threshold: number;
}

/**
 * Available sort options for token list
 */
export type SortOption = 
  | 'price_asc' 
  | 'price_desc' 
  | 'market_cap_asc' 
  | 'market_cap_desc' 
  | 'symbol_asc' 
  | 'symbol_desc' 
  | 'volume_desc';

/**
 * Sort option configuration
 */
export interface SortOptionConfig {
  value: SortOption;
  label: string;
}

/**
 * API response types
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Price update types
 */
export interface PriceUpdate {
  tokenAddress: string;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
  timestamp: Date;
}