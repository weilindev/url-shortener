import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  env: string;
  apiPrefix: string;
  database: {
    url: string;
  };
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
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
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
};

export default config;
