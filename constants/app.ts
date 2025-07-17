// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://dev-screener-api.assetdash.com',
  ENDPOINTS: {
    TOKEN_LIST: '/moby_screener/leaderboard/degen_list',
  },
  QUERY_PARAMS: {
    COMPACT: false,
  },
  RETRY: {
    ATTEMPTS: 3,
    MAX_DELAY: 30000, // 30 seconds
    BASE_DELAY: 1000, // 1 second
  },
} as const;

// Price Update Configuration
export const PRICE_UPDATE_CONFIG = {
  INTERVAL_MS: 10000, // 10 seconds
  MIN_TOKENS_TO_UPDATE: 150,
  MAX_TOKENS_TO_UPDATE: 200,
  MAX_PRICE_CHANGE_PERCENT: 0.15, // 15%
  VOLUME_MULTIPLIER: {
    MIN: 1.0,
    MAX: 1.3,
  },
  TIME_DECAY_FACTORS: {
    M5: 1.0,
    M30: 0.9,
    H1: 0.8,
    H4: 0.7,
    H8: 0.6,
    H24: 0.5,
  },
} as const;

// Query Configuration
export const QUERY_CONFIG = {
  STALE_TIME: 0, // Always fetch fresh data
  REFETCH_INTERVAL: 10000, // 10 seconds
  REFETCH_ON_MOUNT: true,
  REFETCH_ON_WINDOW_FOCUS: false,
  REFETCH_ON_RECONNECT: true,
} as const;

// Storage Configuration
export const STORAGE_KEYS = {
  FILTER_STATE: 'token_filter_state',
  SORT_OPTION: 'token_sort_option',
} as const;

// Default Values
export const DEFAULT_VALUES = {
  FILTER_STATE: {
    is_new: false,
    is_pro: false,
    price_above_threshold: false,
    price_threshold: 0.01, // $0.01
  },
  SORT_OPTION: 'market_cap_desc',
} as const;

// UI Configuration
export const UI_CONFIG = {
  COLORS: {
    POSITIVE: '#4CAF50',
    NEGATIVE: '#F44336',
    PRIMARY: '#007AFF',
    BACKGROUND: '#f5f5f5',
    SURFACE: '#fff',
    BORDER: '#e0e0e0',
    TEXT: {
      PRIMARY: '#000',
      SECONDARY: '#666',
      TERTIARY: '#999',
    },
  },
  ANIMATION: {
    DURATION: 300,
  },
  LIST: {
    INITIAL_NUM_TO_RENDER: 20,
    MAX_TO_RENDER_PER_BATCH: 10,
    WINDOW_SIZE: 21,
    UPDATE_CELL_BATCH_SIZE: 10,
  },
} as const;

// Number Formatting
export const FORMAT_CONFIG = {
  PRICE: {
    DECIMAL_PLACES: 6,
    MIN_VALUE: 0,
  },
  MARKET_CAP: {
    DECIMAL_PLACES: 2,
    DIVISOR: 1_000_000, // Convert to millions
  },
  PERCENTAGE: {
    DECIMAL_PLACES: 2,
  },
} as const;

// Filter Types
export const FILTER_TYPES = {
  BOOLEAN: ['is_new', 'is_pro', 'price_above_threshold'] as const,
  NUMERIC: ['price_threshold'] as const,
} as const;

// Sort Options
export const SORT_OPTIONS = [
  { value: 'market_cap_desc', label: 'Market Cap (High to Low)' },
  { value: 'market_cap_asc', label: 'Market Cap (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'volume_desc', label: 'Volume (24h)' },
  { value: 'symbol_asc', label: 'Symbol (A-Z)' },
  { value: 'symbol_desc', label: 'Symbol (Z-A)' },
] as const;