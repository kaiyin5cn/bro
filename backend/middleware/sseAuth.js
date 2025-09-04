import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

export const authenticateSSE = async (req, res, next) => {
  try {
    const token = req.query.token;
    logger.info('SSE auth attempt', { hasToken: !!token, tokenLength: token?.length });
    
    if (!token) {
      logger.warn('SSE auth failed: no token');
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      return res.end('Access token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info('SSE token decoded', { userId: decoded.userId || decoded.id });
    
    const user = await User.findById(decoded.userId || decoded.id);
    
    if (!user) {
      logger.warn('SSE auth failed: user not found', { userId: decoded.userId || decoded.id });
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      return res.end('Invalid token');
    }
    
    logger.info('SSE auth success', { userId: user._id, role: user.role });
    req.user = user;
    next();
  } catch (error) {
    logger.error('SSE auth error', error);
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    return res.end('Invalid token');
  }
};

export const requireAdminSSE = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Admin access required');
  }
  next();
};