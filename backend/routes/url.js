import express from 'express';
import { shortenUrl, redirectUrl, healthCheck } from '../controllers/urlController.js';
import { validateUrlInput } from '../middleware/validation.js';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// Shorten URL
router.post('/shorten', validateUrlInput, shortenUrl);

// Redirect URL - this should be last to catch shortCode patterns
router.get('/:shortCode', redirectUrl);

export default router;