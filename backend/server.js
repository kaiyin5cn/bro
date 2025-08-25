import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import URL from './models/URL.js';
import { generateShortCode } from './utils/shortCode.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

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

    // Save to database
    const urlDoc = new URL({
      longURL,
      shortCode
    });
    
    await urlDoc.save();

    res.json({ shortURL: `${process.env.BASE_URL}/${shortCode}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:shortCode - Redirect to long URL
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    const urlDoc = await URL.findOneAndUpdate(
      { shortCode },
      { $inc: { accessCount: 1 } },
      { new: true }
    );
    
    if (!urlDoc) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Prevent caching to ensure accessCount increments
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.redirect(302, urlDoc.longURL);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});