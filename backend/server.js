import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { connectRedis, redisClient } from './config/redis.js';
import URL from './models/URL.js';
import { generateShortCode } from './utils/shortCode.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB and Redis
connectDB();
connectRedis();

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    const redisStatus = redisClient.isOpen ? 'connected' : 'disconnected';
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      redis: redisStatus
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      redis: 'error'
    });
  }
});

// POST /shorten - Create short URL
app.post('/shorten', async (req, res) => {
  try {
    const { longURL } = req.body;
    
    if (!longURL) {
      return res.status(400).json({ error: 'longURL is required' });
    }

    // Check if URL already exists
    const existingURL = await URL.findOne({ longURL });
    if (existingURL) {
      return res.json({ shortURL: `${process.env.BASE_URL}/${existingURL.shortCode}` });
    }

    // Generate unique shortCode
    let shortCode;
    let attempts = 0;
    do {
      shortCode = generateShortCode();
      attempts++;
    } while (await URL.findOne({ shortCode }) && attempts < 10);

    if (attempts >= 10) {
      return res.status(500).json({ error: 'Unable to generate unique short code' });
    }

    // Save to database
    const urlDoc = new URL({
      longURL,
      shortCode
    });
    
    await urlDoc.save();

    // Cache in Redis with 24-hour TTL
    try {
      await redisClient.setEx(`url:${shortCode}`, 86400, longURL);
    } catch (error) {
      console.error('Redis cache error:', error);
    }

    res.json({ shortURL: `${process.env.BASE_URL}/${shortCode}` });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:shortCode - Redirect to long URL
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    let longURL;
    
    // Try Redis cache first
    try {
      longURL = await redisClient.get(`url:${shortCode}`);
    } catch (error) {
      console.error('Redis get error:', error);
    }
    
    if (longURL) {
      // Cache hit - increment access count in background
      URL.findOneAndUpdate(
        { shortCode },
        { $inc: { accessCount: 1 } }
      ).catch(err => console.error('Access count update error:', err));
    } else {
      // Cache miss - get from MongoDB
      const urlDoc = await URL.findOneAndUpdate(
        { shortCode },
        { $inc: { accessCount: 1 } },
        { new: true }
      );
      
      if (!urlDoc) {
        return res.status(404).json({ error: 'URL not found' });
      }
      
      longURL = urlDoc.longURL;
      
      // Cache for future requests
      try {
        await redisClient.setEx(`url:${shortCode}`, 86400, longURL);
      } catch (error) {
        console.error('Redis set error:', error);
      }
    }

    // Prevent caching to ensure accessCount increments
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.redirect(302, longURL);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});