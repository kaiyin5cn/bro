import express from 'express';
import { trackDonation, getDonationStatus, getDonationHistory } from '../controllers/donationController.js';
import { validateDonationTracking } from '../middleware/validation.js';

const router = express.Router();

// POST /donation/track - Track completed donation transaction
router.post('/track', validateDonationTracking, trackDonation);

// GET /donation/status/:txHash - Check transaction status
router.get('/status/:txHash', getDonationStatus);

// GET /donation/history/:address - Get donation history for address
router.get('/history/:address', getDonationHistory);

export default router;