import { Token, SortOption, SortOptionConfig } from '@/types/token';
import { SORT_OPTIONS, DEFAULT_VALUES } from '@/constants/app';

/**
 * Comparator function type for token sorting
 */
type TokenComparator = (a: Token, b: Token) => number;

/**
 * Creates a numeric comparator that handles null values
 * @param getValue - Function to extract the numeric value from a token
 * @param ascending - Whether to sort in ascending order
 * @returns Comparator function
 */
const createNumericComparator = (
  getValue: (token: Token) => number | null | undefined,
  ascending: boolean = true
): TokenComparator => {
  return (a: Token, b: Token) => {
    const aValue = getValue(a);
    const bValue = getValue(b);
    
    // Handle null/undefined values - push them to the end
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    // Compare numeric values
    const result = aValue - bValue;
    return ascending ? result : -result;
  };
};

/**
 * Creates a string comparator that handles null values
 * @param getValue - Function to extract the string value from a token
 * @param ascending - Whether to sort in ascending order
 * @returns Comparator function
 */
const createStringComparator = (
  getValue: (token: Token) => string | null | undefined,
  ascending: boolean = true
): TokenComparator => {
  return (a: Token, b: Token) => {
    const aValue = getValue(a);
    const bValue = getValue(b);
    
    // Handle null/undefined values - push them to the end
    if (!aValue && !bValue) return 0;
    if (!aValue) return 1;
    if (!bValue) return -1;
    
    // Compare string values using locale comparison
    const result = aValue.localeCompare(bValue);
    return ascending ? result : -result;
  };
};

/**
 * Map of sort options to their comparator functions
 */
const sortComparators: Record<SortOption, TokenComparator> = {
  price_asc: createNumericComparator((token) => token.price_usd, true),
  price_desc: createNumericComparator((token) => token.price_usd, false),
  market_cap_asc: createNumericComparator((token) => token.market_cap_usd, true),
  market_cap_desc: createNumericComparator((token) => token.market_cap_usd, false),
  symbol_asc: createStringComparator((token) => token.token_symbol, true),
  symbol_desc: createStringComparator((token) => token.token_symbol, false),
  volume_desc: createNumericComparator(
    (token) => token.volume_usd?.h24,
    false
  ),
};

/**
 * Sorts an array of tokens based on the specified sort option
 * @param tokens - Array of tokens to sort
 * @param sortOption - The sort option to apply
 * @returns New sorted array of tokens
 */
export const sortTokens = (tokens: Token[], sortOption: SortOption): Token[] => {
  const comparator = sortComparators[sortOption];
  
  if (!comparator) {
    console.warn(`Unknown sort option: ${sortOption}, returning unsorted`);
    return [...tokens];
  }
  
  // Create a new array and sort it
  return [...tokens].sort(comparator);
};

/**
 * Available sort options for the UI
 */
export const sortOptions: readonly SortOptionConfig[] = SORT_OPTIONS;

/**
 * Get the default sort option
 * @returns The default sort option value
 */
export const getDefaultSortOption = (): SortOption => DEFAULT_VALUES.SORT_OPTION as SortOption;

/**
 * Get the label for a sort option
 * @param sortOption - The sort option value
 * @returns The human-readable label or the option value if not found
 */
export const getSortOptionLabel = (sortOption: SortOption): string => {
  const option = sortOptions.find((opt) => opt.value === sortOption);
  return option?.label ?? sortOption;
};

/**
 * Validate if a string is a valid sort option
 * @param value - The value to check
 * @returns Whether the value is a valid sort option
 */
export const isValidSortOption = (value: string): value is SortOption => {
  return sortOptions.some((opt) => opt.value === value);
};