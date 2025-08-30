import { connectDB } from '../config/database.js';
import Url from '../models/Url.js';
import { generateShortCode } from '../utils/shortCode.js';
import dotenv from 'dotenv';

dotenv.config();

const popularDomains = [
  'https://google.com',
  'https://youtube.com',
  'https://facebook.com',
  'https://twitter.com',
  'https://instagram.com',
  'https://linkedin.com',
  'https://github.com',
  'https://stackoverflow.com',
  'https://reddit.com',
  'https://amazon.com',
  'https://netflix.com',
  'https://microsoft.com',
  'https://apple.com',
  'https://wikipedia.org',
  'https://medium.com',
  'https://discord.com',
  'https://twitch.tv',
  'https://spotify.com',
  'https://dropbox.com',
  'https://zoom.us'
];

async function generateExampleUrls() {
  try {
    await connectDB();
    
    console.log('🔗 Generating example URL instances...\n');
    
    const existingCount = await Url.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing URLs in database`);
      console.log('   Skipping generation to avoid duplicates');
      process.exit(0);
    }
    
    const urlsToCreate = [];
    
    for (const domain of popularDomains) {
      // Generate unique short code
      let shortCode;
      let attempts = 0;
      
      do {
        shortCode = generateShortCode();
        attempts++;
      } while (urlsToCreate.some(url => url.shortCode === shortCode) && attempts < 10);
      
      if (attempts >= 10) {
        console.warn(`⚠️  Could not generate unique code for ${domain}`);
        continue;
      }
      
      urlsToCreate.push({
        longURL: domain,
        shortCode,
        accessCount: Math.floor(Math.random() * 100) // Random access count 0-99
      });
    }
    
    // Insert all URLs
    const result = await Url.insertMany(urlsToCreate);
    
    console.log(`✅ Created ${result.length} example URLs:`);
    console.log('');
    
    result.forEach(url => {
      console.log(`   ${process.env.BASE_URL || 'http://localhost:8828'}/${url.shortCode} → ${url.longURL}`);
    });
    
    console.log('');
    console.log('🎉 Example URLs generated successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Failed to generate example URLs:', error.message);
    process.exit(1);
  }
}

generateExampleUrls();