import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { connectRedis } from './config/redis.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import urlRoutes from './routes/url.js';
import donationRoutes from './routes/donation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB and Redis
connectDB();
connectRedis();

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/donation', donationRoutes);
app.use('/', urlRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});