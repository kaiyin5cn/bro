import URL from '../models/URL.js';
import mongoose from 'mongoose';

export const getAllUrls = async (req, res) => {
  try {
    const urls = await URL.find({})
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid URL ID' });
    }
    
    const url = await URL.findByIdAndDelete(req.params.id);
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
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
    const existingUrl = await URL.findOne({ shortCode, _id: { $ne: req.params.id } });
    if (existingUrl) {
      return res.status(400).json({ error: 'Short code already exists' });
    }
    
    const url = await URL.findByIdAndUpdate(
      req.params.id,
      { shortCode },
      { new: true, runValidators: true }
    );
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    res.json(url);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};