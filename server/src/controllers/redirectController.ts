import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import type { Url } from '../types/url.types.js';
import { CustomError } from '../utils/errors.js';

/**
 * Get client IP address from request
 * Handles proxy headers (X-Forwarded-For, X-Real-IP)
 */
function getClientIp(req: Request): string | undefined {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') {
    return realIp;
  }
  return req.socket.remoteAddress;
}

/**
 * Redirect to original URL and record analytics
 * @route GET /r/:code
 */
export const redirectToOriginalUrl = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;

  // Fetch URL by short code
  const result = await supabase.from('urls').select('*').eq('short_code', code).single();

  if (result.error || !result.data) {
    throw new CustomError('URL not found', 404);
  }

  const url = result.data as Url;

  // Check if URL is active
  if (!url.is_active) {
    throw new CustomError('This URL has been deactivated', 410);
  }

  // Check if URL has expired
  if (url.expires_at && new Date(url.expires_at) < new Date()) {
    throw new CustomError('This URL has expired', 410);
  }

  // Collect analytics data
  const ipAddress = getClientIp(req);
  const userAgent = req.headers['user-agent'];
  const referrer = req.headers['referer'] || req.headers['referrer'];

  // Record click analytics (non-blocking - don't wait for response)
  // We use Promise.all to run both operations concurrently
  Promise.all([
    // Insert click analytics record
    supabase.from('click_analytics').insert({
      url_id: url.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      referrer: referrer,
    }),
    // Increment click count
    supabase
      .from('urls')
      .update({ clicks: url.clicks + 1 })
      .eq('short_code', code),
  ]).catch((error) => {
    // Log error but don't block the redirect
    console.error('Failed to record analytics:', error);
  });

  // Perform 302 redirect (temporary redirect)
  res.redirect(302, url.original_url);
};
