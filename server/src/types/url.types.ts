/**
 * URL shortener related types
 */

export interface Url {
  id: string;
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  updatedAt: string;
  clicks: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface CreateUrlRequest {
  originalUrl: string;
  customCode?: string;
  expiresAt?: string;
}

export interface UpdateUrlRequest {
  originalUrl?: string;
  isActive?: boolean;
  expiresAt?: string;
}

export interface UrlListResponse {
  data: Url[];
  count: number;
}
