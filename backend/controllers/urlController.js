import Url from '../models/URL.js';
import { generateShortCode } from '../utils/shortCode.js';
import { redisClient } from '../config/redis.js';
import { logger } from '../utils/logger.js';

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

    // Generate unique shortCode with batch checking
    let shortCode;
    const batchSize = 5;
    const candidates = [];
    
    // Generate batch of candidates
    for (let i = 0; i < batchSize; i++) {
      candidates.push(generateShortCode());
    }
    
    // Check all candidates in single query
    const existingCodes = await Url.find({ 
      shortCode: { $in: candidates } 
    }).select('shortCode');
    
    const existingSet = new Set(existingCodes.map(doc => doc.shortCode));
    shortCode = candidates.find(code => !existingSet.has(code));
    
    if (!shortCode) {
      return res.status(500).json({ error: 'Unable to generate unique short code' });
    }

    // Save to database
    const urlDoc = new Url({
      longURL: finalURL,
      shortCode
    });
    
    await urlDoc.save();

    // Cache in Redis with 24-hour TTL
    try {
      await redisClient.setEx(`url:${shortCode}`, 86400, finalURL);
    } catch (error) {
      logger.error('Redis cache store failed', error, { shortCode });
    }

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
    
    // Try Redis cache first
    try {
      longURL = await redisClient.get(`url:${shortCode}`);
    } catch (error) {
      logger.error('Redis cache get failed', error, { shortCode });
    }
    
    if (longURL) {
      // Cache hit - increment access count in background
      Url.findOneAndUpdate(
        { shortCode },
        { $inc: { accessCount: 1 } }
      ).catch(err => logger.error('Access count update failed', err, { shortCode }));
    } else {
      // Cache miss - get from MongoDB
      const urlDoc = await Url.findOneAndUpdate(
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
        logger.error('Redis cache set failed', error, { shortCode });
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