
# About

This project is a takehome assignment for a job. The goal is to meet the requirements, in a simple and concise manner, showing production considerations.

# Stack

- React Native using Expo go.
- Basic styling with style params
- React Query for all fetching and caching.
- AsyncStorage for simple persistent state

# Commands

- `bun run start` - Start the development server
- `bun run reset-project` - Reset the project to initial state
- `bun run android` - Start the development server and open Android
- `bun run ios` - Start the development server and open iOS
- `bun run web` - Start the development server and open web
- `bun run lint` - Run linting checks

# Requirements

1. Use the following API to fetch a list of objects: https://dev-screener-api.assetdash.com/moby_screener/leaderboard/degen_list?compact=false
2. Display the list.
3. Implement a mechanism to update the price of some items every 10 seconds with a new random value, as well as other relevant fields.
4. Add two or three filters that can be toggled on/off and affect the items shown in the list (e.g. is_new, is_pro, price greater than X, etc.). The selected filters must remain stored even after navigating away from the screen or restarting the app.
5. Add options to order the list
6. Initially, the full dataset should be shown.

# Considerations

- Visual design is not a priority.
- Prioritize clean code, good separation of concerns, and a practical approach to data handling.
