import URL from '../models/URL.js';
import { generateShortCode } from '../utils/shortCode.js';
import { redisClient } from '../config/redis.js';
import { logger } from '../utils/logger.js';

export const shortenUrl = async (req, res) => {
  try {
    const { longURL } = req.body;
    
    if (!longURL) {
      return res.status(400).json({ error: 'longURL is required' });
    }

    // Validate URL and check against blacklisted domains
    try {
      const url = new URL(longURL.trim());
      
      // Only allow HTTP/HTTPS protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        return res.status(400).json({ error: 'Only HTTP and HTTPS URLs are allowed' });
      }
      
      // Check against blacklisted domains
      const blacklistedDomains = (process.env.BLACKLISTED_DOMAINS || 'malware.com,phishing.com,spam.com').split(',');
      const isBlacklisted = blacklistedDomains.some(domain => 
        url.hostname === domain || url.hostname.endsWith('.' + domain)
      );
      
      if (isBlacklisted) {
        return res.status(400).json({ error: 'Domain is not allowed for shortening' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Prevent shortening our own short URLs
    const baseUrl = process.env.BASE_URL || 'http://localhost:8828';
    const shortUrlPattern = new RegExp(`^${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[a-zA-Z0-9]{7}$`);
    if (shortUrlPattern.test(longURL.trim())) {
      return res.status(400).json({ error: 'Cannot shorten an already shortened URL' });
    }

    // Check if URL already exists
    const existingURL = await URL.findOne({ longURL });
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
    const existingCodes = await URL.find({ 
      shortCode: { $in: candidates } 
    }).select('shortCode');
    
    const existingSet = new Set(existingCodes.map(doc => doc.shortCode));
    shortCode = candidates.find(code => !existingSet.has(code));
    
    if (!shortCode) {
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
    let longURL;
    
    // Try Redis cache first
    try {
      longURL = await redisClient.get(`url:${shortCode}`);
    } catch (error) {
      logger.error('Redis cache get failed', error, { shortCode });
    }
    
    if (longURL) {
      // Cache hit - increment access count in background
      URL.findOneAndUpdate(
        { shortCode },
        { $inc: { accessCount: 1 } }
      ).catch(err => logger.error('Access count update failed', err, { shortCode }));
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