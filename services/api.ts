import { TokenList, ApiError } from '@/types/token';
import { API_CONFIG } from '@/constants/app';

/**
 * NOTE: This API does not support CORS headers for web browsers.
 * To test the app properly, please use:
 * - iOS: bun run ios
 * - Android: bun run android
 * - Or use a browser extension to disable CORS for local development
 */

/**
 * Custom error class for API-related errors
 */
class ApiRequestError extends Error implements ApiError {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

/**
 * Token API service for fetching token data
 */
export const tokenApi = {
  /**
   * Fetches the list of tokens from the API
   * @returns Promise with the token list
   * @throws {ApiRequestError} When the API request fails
   */
  fetchTokenList: async (): Promise<TokenList> => {
    try {
      // Build URL with configuration
      const url = new URL(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOKEN_LIST}`
      );
      url.searchParams.append('compact', String(API_CONFIG.QUERY_PARAMS.COMPACT));
      // Add timestamp to bypass any caching
      url.searchParams.append('_t', String(Date.now()));

      const response = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new ApiRequestError(
          `API request failed: ${response.statusText}`,
          'API_REQUEST_FAILED',
          response.status
        );
      }
      
      const data = await response.json();
      
      // Validate response data
      if (!Array.isArray(data)) {
        throw new ApiRequestError(
          'Invalid response format: expected array',
          'INVALID_RESPONSE_FORMAT'
        );
      }
      
      return data as TokenList;
    } catch (error) {
      // Network or parsing errors
      if (error instanceof ApiRequestError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiRequestError(
          'Network error: Unable to connect to the API',
          'NETWORK_ERROR'
        );
      }
      
      throw new ApiRequestError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        'UNKNOWN_ERROR'
      );
    }
  },
};