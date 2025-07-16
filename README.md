# AssetDash Takehome Project

A React Native application built with Expo that displays cryptocurrency token data with real-time price updates, filtering, and sorting capabilities.

## Prerequisites

- Node.js (v18 or higher)
- Bun package manager
- Expo Go app on your phone (for mobile testing)
- Android Studio or Xcode (for emulator testing)

## Installation

```bash
# Install dependencies using bun
bun install
```

## Running the App

### iOS Simulator (Recommended)

```bash
bun run ios
```

### Android Emulator (Recommended)

```bash
bun run android
```

### Physical Device with Expo Go

```bash
bun run start
```

Then scan the QR code with:
- iOS: Camera app
- Android: Expo Go app

### Web (Not Recommended)

```bash
bun run web
```

**⚠️ Important Note:** The API endpoint does not support CORS headers, so the web version will not be able to fetch data. Please use iOS or Android for proper testing.

## Features Implemented

1. **Token List Display**: Fetches and displays crypto tokens from the API endpoint
2. **Real-time Price Updates**: Automatically updates 3-8 random token prices every 10 seconds with realistic market movements
3. **Filtering Options**:
   - New tokens only
   - Pro tokens only
   - Minimum price threshold (customizable)
4. **Sorting Options**:
   - Market Cap (High to Low / Low to High)
   - Price (High to Low / Low to High)
   - 24h Volume
   - Symbol (A-Z / Z-A)
5. **Persistent Settings**: Filter and sort preferences are saved using AsyncStorage and persist across app restarts
6. **Pull to Refresh**: Swipe down to refresh token data from the API

## Architecture

- **React Query**: For efficient data fetching, caching, and synchronization
- **Custom Hooks**: Clean separation of business logic (`useTokens`, `usePriceUpdates`, `useFilters`, `useSort`)
- **TypeScript**: Full type safety throughout the application
- **AsyncStorage**: Persistent storage for user preferences
- **Modular Components**: Reusable UI components with clear interfaces

## Project Structure

```
assetdash-takehome/
├── app/                    # App routes and screens
├── components/            # Reusable UI components
│   ├── TokenList.tsx     # Main token list display
│   ├── FilterPanel.tsx   # Filter controls
│   └── SortPicker.tsx    # Sort options modal
├── hooks/                 # Custom React hooks
│   ├── useTokens.ts      # Token data fetching
│   ├── usePriceUpdates.ts # Real-time price updates
│   ├── useFilters.ts     # Filter state management
│   └── useSort.ts        # Sort state management
├── services/             # API services
│   └── api.ts           # API client
├── types/                # TypeScript type definitions
│   └── token.ts         # Token data types
└── utils/                # Utility functions
    ├── filterStorage.ts  # Filter persistence
    └── sorting.ts       # Sorting logic
```

## API Endpoint

The app fetches data from:
```
https://dev-screener-api.assetdash.com/moby_screener/leaderboard/degen_list?compact=false
```

## Development Considerations

- **Performance**: React Query handles caching to minimize API calls
- **User Experience**: Loading states, error handling, and smooth animations
- **Code Quality**: Clean code with separation of concerns and TypeScript for type safety
- **Production Ready**: Error boundaries, proper error messages, and graceful fallbacks

## Troubleshooting

### Build Issues
If you encounter build issues:
```bash
# Clear cache and reinstall
rm -rf node_modules
bun install
bun run start --clear
```

### Expo Go Connection Issues
- Ensure your device and computer are on the same network
- Try using a cable connection for more stable development

### Development Server Issues
```bash
# Kill any existing Expo processes
pkill -f expo
# Restart with cache clear
bun run start --clear
```

## Available Scripts

- `bun run start` - Start the development server
- `bun run android` - Start Android emulator and development server
- `bun run ios` - Start iOS simulator and development server
- `bun run web` - Start web development server (limited functionality)
- `bun run lint` - Run ESLint checks
- `bun run reset-project` - Reset project to initial state

## Notes

This project was built as a takehome assignment to demonstrate:
- Clean, production-ready code
- Proper state management
- API integration
- Real-time data updates
- Persistent user preferences
- Responsive UI design