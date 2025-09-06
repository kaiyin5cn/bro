export const config = {
  gameUrl: import.meta.env.VITE_GAME_URL || 'http://localhost:8000',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8828',
  maxSearchLength: parseInt(import.meta.env.VITE_MAX_SEARCH_LENGTH) || 100,
  maxLimitSize: parseInt(import.meta.env.VITE_MAX_LIMIT_SIZE) || 100
};