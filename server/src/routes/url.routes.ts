import { Router } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import {
  createUrl,
  getUrls,
  getUrlByCode,
  updateUrl,
  deleteUrl,
  incrementClicks,
} from '../controllers/urlController.js';

const router = Router();

/**
 * @route   POST /api/urls
 * @desc    Create a new shortened URL
 * @access  Public
 */
router.post('/', asyncHandler(createUrl));

/**
 * @route   GET /api/urls
 * @desc    Get all URLs with pagination
 * @access  Public
 */
router.get('/', asyncHandler(getUrls));

/**
 * @route   GET /api/urls/:code
 * @desc    Get a single URL by short code
 * @access  Public
 */
router.get('/:code', asyncHandler(getUrlByCode));

/**
 * @route   PUT /api/urls/:code
 * @desc    Update a URL by short code
 * @access  Public
 */
router.put('/:code', asyncHandler(updateUrl));

/**
 * @route   DELETE /api/urls/:code
 * @desc    Delete a URL by short code
 * @access  Public
 */
router.delete('/:code', asyncHandler(deleteUrl));

/**
 * @route   POST /api/urls/:code/click
 * @desc    Increment click count for a URL
 * @access  Public
 */
router.post('/:code/click', asyncHandler(incrementClicks));

export default router;
