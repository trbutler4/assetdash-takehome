import { TokenList } from '@/types/token';

const API_BASE_URL = 'https://dev-screener-api.assetdash.com';

export const tokenApi = {
  fetchTokenList: async (): Promise<TokenList> => {
    const response = await fetch(
      `${API_BASE_URL}/moby_screener/leaderboard/degen_list?compact=false`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as TokenList;
  },
};