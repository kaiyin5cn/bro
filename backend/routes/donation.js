import express from 'express';
import { createDonation, getDonationStatus } from '../controllers/donationController.js';
import { validateDonationInput } from '../middleware/validation.js';

const router = express.Router();

// POST /donation/create - Create donation and mint NFT
router.post('/create', validateDonationInput, createDonation);

// GET /donation/status/:txHash - Check transaction status
router.get('/status/:txHash', getDonationStatus);

export default router;