import Url from '../models/URL.js';
import { generateShortCode } from '../utils/shortCode.js';
import { redisClient } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { broadcastUpdate } from './adminController.js';

export const shortenUrl = async (req, res) => {
  try {
    const { longURL } = req.body;
    
    if (!longURL) {
      return res.status(400).json({ error: 'longURL is required' });
    }

    let finalURL = longURL.trim();
    
    // Validate URL format
    try {
      new URL(finalURL);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Log client request
    logger.info('URL shortening request', {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      longURL: finalURL
    });
    
    // Check if URL already exists
    const existingURL = await Url.findOne({ longURL: finalURL });
    if (existingURL) {
      return res.json({ shortURL: `${process.env.BASE_URL}/${existingURL.shortCode}` });
    }

    // Generate and save with retry on collision
    let urlDoc;
    let shortCode;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      shortCode = generateShortCode();
      
      try {
        urlDoc = new Url({
          longURL: finalURL,
          shortCode
        });
        
        await urlDoc.save();
        break; // Success, exit loop
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error, try again
          attempts++;
          continue;
        }
        throw error; // Other error, rethrow
      }
    }
    
    if (attempts >= maxAttempts) {
      return res.status(500).json({ error: 'Unable to generate unique short code' });
    }

    // Cache in Redis with 24-hour TTL
    try {
      await redisClient.setEx(`url:${shortCode}`, 86400, finalURL);
    } catch (error) {
      logger.error('Redis cache store failed', error, { shortCode });
    }

    // Broadcast new URL creation
    broadcastUpdate({
      type: 'urlCreated',
      data: urlDoc
    });

    res.json({ shortURL: `${process.env.BASE_URL}/${shortCode}` });
  } catch (error) {
    logger.error('URL shortening failed', error, { longURL: req.body.longURL });
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    // Log redirect request
    logger.info('URL redirect request', {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      shortCode
    });
    
    let longURL;
    
    // 1. Try Redis cache first
    try {
      longURL = await redisClient.get(`url:${shortCode}`);
    } catch (error) {
      logger.error('Redis cache get failed', error, { shortCode });
    }
    
    // 2. If not in cache, find URL in database
    if (!longURL) {
      const urlDoc = await Url.findOne({ shortCode });
      
      if (!urlDoc) {
        return res.status(404).json({ error: 'URL not found' });
      }
      
      longURL = urlDoc.longURL;
    }

    // 3. Redirect immediately if URL found
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.redirect(302, longURL);
    
    // 4. Update access count and cache in background
    process.nextTick(async () => {
      try {
        // Update access count
        const updatedUrl = await Url.findOneAndUpdate(
          { shortCode },
          { $inc: { accessCount: 1 } },
          { new: true }
        );
        
        // Broadcast real-time update
        if (updatedUrl) {
          broadcastUpdate({
            type: 'accessCount',
            data: {
              _id: updatedUrl._id.toString(),
              accessCount: updatedUrl.accessCount
            }
          });
        }
        
        // Cache in Redis for future requests
        await redisClient.setEx(`url:${shortCode}`, 86400, longURL);
      } catch (error) {
        logger.error('Background update failed', error, { shortCode });
      }
    });
    
  } catch (error) {
    logger.error('URL redirect failed', error, { shortCode: req.params.shortCode });
    res.status(500).json({ error: 'Server error' });
  }
};

export const healthCheck = async (req, res) => {
  try {
    const redisEnabled = process.env.REDIS_ENABLED !== 'false';
    const redisStatus = redisEnabled 
      ? (redisClient.isOpen ? 'connected' : 'disconnected')
      : 'disabled';
    
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
};