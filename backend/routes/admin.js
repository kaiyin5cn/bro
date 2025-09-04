import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { authenticateSSE, requireAdminSSE } from '../middleware/sseAuth.js';
import { getAllUrls, deleteUrl, updateUrl, sseUpdates } from '../controllers/adminController.js';
import { validateAdminInput } from '../middleware/validation.js';

const router = express.Router();

// GET /admin/urls - Get all URLs (admin only)
router.get('/urls', authenticate, requireAdmin, getAllUrls);

// DELETE /admin/urls/:id - Delete URL (admin only)
router.delete('/urls/:id', authenticate, requireAdmin, deleteUrl);

// PUT /admin/urls/:id - Update URL (admin only)
router.put('/urls/:id', authenticate, requireAdmin, validateAdminInput, updateUrl);

// GET /admin/updates - SSE endpoint for real-time updates
router.get('/updates', authenticateSSE, requireAdminSSE, sseUpdates);

export default router;