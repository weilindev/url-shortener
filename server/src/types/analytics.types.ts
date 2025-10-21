/**
 * Analytics related types for tracking URL clicks
 */

export interface ClickAnalytics {
  id: string;
  urlId: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  clickedAt: string;
}

export interface RecordClickRequest {
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}
