import { createClient } from '@supabase/supabase-js';
import config from './index.js';

// Validate required Supabase configuration
if (!config.supabase.url) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!config.supabase.anonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

/**
 * Supabase client for client-side operations
 * Uses the anon key and respects Row Level Security (RLS) policies
 */
export const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // Server-side doesn't need session persistence
  },
});

/**
 * Supabase admin client for server-side operations
 * Uses the service role key and bypasses Row Level Security (RLS)
 * Only use this for trusted server-side operations
 */
export const supabaseAdmin = config.supabase.serviceRoleKey
  ? createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Warn if service role key is not configured
if (!supabaseAdmin && config.env === 'development') {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not configured. Admin operations will not be available.');
}

export default supabase;
