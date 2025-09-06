import Url from '../models/Url.js';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

// Store SSE connections
const sseConnections = new Set();

export const getAllUrls = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const searchQuery = req.query.search || '';
    const searchCategory = req.query.category || 'all';
    
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = { [sortField]: sortOrder };
    
    // Build search filter
    let filter = {};
    if (searchQuery.trim()) {
      switch (searchCategory) {
        case 'longURL':
          filter.longURL = { $regex: searchQuery, $options: 'i' };
          break;
        case 'shortCode':
          filter.shortCode = { $regex: searchQuery, $options: 'i' };
          break;
        default: // 'all'
          filter.$or = [
            { longURL: { $regex: searchQuery, $options: 'i' } },
            { shortCode: { $regex: searchQuery, $options: 'i' } }
          ];
      }
    }
    
    const [urls, total] = await Promise.all([
      Url.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Url.countDocuments(filter)
    ]);
    
    res.json({
      urls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      search: {
        query: searchQuery,
        category: searchCategory
      }
    });
  } catch (error) {
    logger.error('Failed to fetch URLs', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid URL ID' });
    }
    
    const url = await Url.findByIdAndDelete(req.params.id);
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    // Broadcast deletion
    broadcastUpdate({
      type: 'urlDeleted',
      data: { _id: url._id.toString() }
    });
    
    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete URL', error, { id: req.params.id });
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUrl = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid URL ID' });
    }
    
    const { shortCode } = req.body;
    
    if (!shortCode) {
      return res.status(400).json({ error: 'shortCode is required' });
    }
    
    // Check if shortCode already exists
    const existingUrl = await Url.findOne({ shortCode, _id: { $ne: req.params.id } });
    if (existingUrl) {
      return res.status(400).json({ error: 'Short code already exists' });
    }
    
    const url = await Url.findByIdAndUpdate(
      req.params.id,
      { shortCode },
      { new: true, runValidators: true }
    );
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    // Broadcast update
    broadcastUpdate({
      type: 'urlUpdated',
      data: url
    });
    
    res.json(url);
  } catch (error) {
    logger.error('Failed to update URL', error, { id: req.params.id, shortCode: req.body.shortCode });
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const sseUpdates = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  
  sseConnections.add(res);
  
  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE connected' })}\n\n`);
  
  req.on('close', () => {
    sseConnections.delete(res);
  });
};

export const broadcastUpdate = (data) => {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  sseConnections.forEach(res => {
    try {
      res.write(message);
    } catch (error) {
      sseConnections.delete(res);
    }
  });
};