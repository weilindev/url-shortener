import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import type { CreateUrlRequest, UpdateUrlRequest, Url } from '../types/url.types.js';
import { CustomError } from '../utils/errors.js';

/**
 * Generate a random short code
 */
function generateShortCode(length: number = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Test Supabase connection
 */
export const testConnection = async (_req: Request, res: Response): Promise<void> => {
  // Simple query to test connection
  const { data, error } = await supabase.from('urls').select('count');

  if (error) {
    throw new CustomError('Failed to connect to Supabase', 500);
  }

  res.json({
    message: 'Successfully connected to Supabase',
    data,
  });
};

/**
 * Create a new shortened URL
 */
export const createUrl = async (req: Request, res: Response): Promise<void> => {
  const { originalUrl, customCode, expiresAt } = req.body as CreateUrlRequest;

  if (!originalUrl) {
    throw new CustomError('originalUrl is required', 400);
  }

  // Validate URL format
  try {
    new URL(originalUrl);
  } catch {
    throw new CustomError('Invalid URL format', 400);
  }

  // Generate short code if not provided
  const shortCode = customCode || generateShortCode();

  // Check if short code already exists
  const { data: existing } = await supabase
    .from('urls')
    .select('shortCode')
    .eq('shortCode', shortCode)
    .single();

  if (existing) {
    throw new CustomError('Short code already exists', 409);
  }

  // Insert new URL
  const result = await supabase
    .from('urls')
    .insert({
      shortCode,
      originalUrl,
      expiresAt: expiresAt || null,
      clicks: 0,
      isActive: true,
    })
    .select()
    .single();

  if (result.error || !result.data) {
    throw new CustomError('Failed to create URL', 500);
  }

  res.status(201).json({
    success: true,
    message: 'URL created successfully',
    data: result.data as Url,
  });
};

/**
 * Get all URLs with pagination
 */
export const getUrls = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  // Get total count
  const { count } = await supabase.from('urls').select('*', { count: 'exact', head: true });

  // Get paginated data
  const result = await supabase
    .from('urls')
    .select('*')
    .order('createdAt', { ascending: false })
    .range(offset, offset + limit - 1);

  if (result.error || !result.data) {
    throw new CustomError('Failed to fetch URLs', 500);
  }

  res.json({
    success: true,
    data: result.data as Url[],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
};

/**
 * Get a single URL by short code
 */
export const getUrlByCode = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;

  const result = await supabase.from('urls').select('*').eq('shortCode', code).single();

  if (result.error || !result.data) {
    throw new CustomError('URL not found', 404);
  }

  res.json({
    success: true,
    data: result.data as Url,
  });
};

/**
 * Update a URL by short code
 */
export const updateUrl = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;
  const updates = req.body as UpdateUrlRequest;

  // Validate that there's something to update
  if (Object.keys(updates).length === 0) {
    throw new CustomError('No fields to update', 400);
  }

  // Update the URL
  const result = await supabase
    .from('urls')
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq('shortCode', code)
    .select()
    .single();

  if (result.error || !result.data) {
    throw new CustomError('URL not found or failed to update', 404);
  }

  res.json({
    success: true,
    message: 'URL updated successfully',
    data: result.data as Url,
  });
};

/**
 * Delete a URL by short code
 */
export const deleteUrl = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;

  const { error } = await supabase.from('urls').delete().eq('shortCode', code);

  if (error) {
    throw new CustomError('URL not found or failed to delete', 404);
  }

  res.json({
    success: true,
    message: 'URL deleted successfully',
  });
};

/**
 * Increment click count for a URL
 */
export const incrementClicks = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;

  // First get the current URL
  const fetchResult = await supabase.from('urls').select('*').eq('shortCode', code).single();

  if (fetchResult.error || !fetchResult.data) {
    throw new CustomError('URL not found', 404);
  }

  const url = fetchResult.data as Url;

  // Check if URL is active and not expired
  if (!url.isActive) {
    throw new CustomError('URL is inactive', 410);
  }

  if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
    throw new CustomError('URL has expired', 410);
  }

  // Increment clicks
  const updateResult = await supabase
    .from('urls')
    .update({ clicks: url.clicks + 1 })
    .eq('shortCode', code)
    .select()
    .single();

  if (updateResult.error || !updateResult.data) {
    throw new CustomError('Failed to increment clicks', 500);
  }

  const updatedUrl = updateResult.data as Url;

  res.json({
    success: true,
    message: 'Click recorded',
    data: {
      originalUrl: updatedUrl.originalUrl,
      clicks: updatedUrl.clicks,
    },
  });
};
