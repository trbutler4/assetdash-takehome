import { TokenList } from '@/types/token';

const API_BASE_URL = 'https://dev-screener-api.assetdash.com';

// NOTE: This API does not support CORS headers for web browsers.
// To test the app properly, please use:
// - iOS: bun run ios
// - Android: bun run android
// - Or use a browser extension to disable CORS for local development

export const tokenApi = {
  fetchTokenList: async (): Promise<TokenList> => {
    // Add timestamp to bypass any caching
    const timestamp = Date.now();
    const response = await fetch(
      `${API_BASE_URL}/moby_screener/leaderboard/degen_list?compact=false&_t=${timestamp}`,
      {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as TokenList;
  },
};