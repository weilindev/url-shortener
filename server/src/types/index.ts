// Custom error types
export interface CustomError extends Error {
  statusCode?: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
}

// URL Shortener specific types
export interface UrlMapping {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt?: Date;
  clickCount: number;
}

export interface CreateUrlRequest {
  url: string;
  customCode?: string;
  expiresIn?: number; // in days
}
