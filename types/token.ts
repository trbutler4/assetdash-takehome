export interface TimeSeriesData {
  m5: number;
  m30: number;
  h1: number;
  h4: number;
  h8: number;
  h24: number;
}

export interface Token {
  token_address: string;
  token_symbol: string;
  token_icon: string;
  token_created: number;
  price_usd: number;
  market_cap_usd: number;
  total_supply: number;
  price_change_percent: TimeSeriesData;
  whale_count: TimeSeriesData;
  whale_trades_count: TimeSeriesData;
  whale_buys_count: TimeSeriesData;
  whale_buy_volume_usd: TimeSeriesData;
  whale_sells_count: TimeSeriesData;
  whale_sell_volume_usd: TimeSeriesData;
  whale_net_flow_usd: TimeSeriesData;
  whale_buy_amount: TimeSeriesData;
  whale_sell_amount: TimeSeriesData;
  whale_net_amount: TimeSeriesData;
  whale_holder_retention_percent: TimeSeriesData;
  whale_buy_supply_percent: TimeSeriesData;
  whale_sell_supply_percent: TimeSeriesData;
  whale_net_supply_percent: TimeSeriesData;
  volume_usd: TimeSeriesData;
  liquidity_usd: number;
  transactions_count: TimeSeriesData;
  is_new: boolean;
  is_pump: boolean;
  is_pro: boolean;
  is_bonk: boolean;
  is_believe: boolean;
  is_xstocks: boolean | null;
  is_ray: boolean;
  antirug_score: number | null;
  launchpad: string | null;
  score_values: TimeSeriesData;
}

export type TokenList = Token[];

// Filter types
export interface FilterState {
  is_new: boolean;
  is_pro: boolean;
  price_above_threshold: boolean;
  price_threshold: number;
}

// Sort options
export type SortOption = 'price_asc' | 'price_desc' | 'market_cap_asc' | 'market_cap_desc' | 'symbol_asc' | 'symbol_desc' | 'volume_desc';