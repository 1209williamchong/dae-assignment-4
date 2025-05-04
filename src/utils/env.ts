export const env = {
  API_URL: 'https://dae-mobile-assignment.hkit.cc/api',
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};
