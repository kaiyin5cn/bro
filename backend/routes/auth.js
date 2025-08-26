import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateAuthInput } from '../middleware/validation.js';

const router = express.Router();

// POST /auth/register
router.post('/register', validateAuthInput, register);

// POST /auth/login
router.post('/login', validateAuthInput, login);

export default router;