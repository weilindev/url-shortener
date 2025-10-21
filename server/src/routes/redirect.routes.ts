import { Router } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { redirectToOriginalUrl } from '../controllers/redirectController.js';

const router = Router();

/**
 * @route   GET /r/:code
 * @desc    Redirect to original URL and record analytics
 * @access  Public
 */
router.get('/:code', asyncHandler(redirectToOriginalUrl));

export default router;
