/**
 * URL shortener related types
 * Note: Using snake_case to match Supabase/PostgreSQL column names
 */

export interface Url {
  id: string;
  short_code: string;
  original_url: string;
  created_at: string;
  updated_at: string;
  clicks: number;
  expires_at?: string;
  is_active: boolean;
}

export interface CreateUrlRequest {
  original_url: string;
  custom_code?: string;
  expires_at?: string;
}

export interface UpdateUrlRequest {
  original_url?: string;
  is_active?: boolean;
  expires_at?: string;
}

export interface UrlListResponse {
  data: Url[];
  count: number;
}
