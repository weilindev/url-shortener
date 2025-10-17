interface Config {
  port: number;
  env: string;
  apiPrefix: string;
  database: {
    url: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || '',
  },
};

export default config;
