import { setupEnvironment, installDependencies, runTests } from './utils/system-setup.js';

async function createAdmin() {
  try {
    const { connectDB } = await import('../config/database.js');
    const User = (await import('../models/User.js')).default;

    await connectDB();

    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    const admin = new User({
      username: 'admin',
      password: 'Admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('   Username: admin');
    console.log('   Password: Admin123');
    console.log('   ⚠️  Change password in production!');
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    throw error;
  }
}

async function generateExamples() {
  try {
    const { connectDB } = await import('../config/database.js');
    const Url = (await import('../models/URL.js')).default;
    const { generateShortCode } = await import('../utils/shortCode.js');

    await connectDB();

    const existingCount = await Url.countDocuments();
    if (existingCount > 100) {
      console.log(`ℹ️  Found ${existingCount} existing URLs, skipping example generation`);
      return;
    }

    const popularDomains = [
      // Initial 20 domains
      'https://google.com',
      'https://youtube.com',
      'https://facebook.com',
      'https://twitter.com', // Now commonly referred to as X.com
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
      'https://zoom.us',

      // Additional 100 domains for a total of 120
      // Search Engines & AI
      'https://bing.com', // [1, 12]
      'https://chatgpt.com', // [1, 2, 4]
      'https://yahoo.com', // [7, 16]
      'https://duckduckgo.com', // [2]

      // Social Media & Communication
      'https://tiktok.com', // [2, 5, 6]
      'https://whatsapp.com', // [5, 6, 14]
      'https://wechat.com', // [6, 10]
      'https://telegram.org', // [2, 6, 14]
      'https://snapchat.com', // [5, 6, 10]
      'https://pinterest.com', // [5, 10]
      'https://quora.com',
      'https://tumblr.com',
      'https://flickr.com',
      'https://vimeo.com',
      'https://mastodon.social', // [6]
      'https://bsky.app', // [6]
      'https://threads.net', // [6]
      'https://messenger.com', // [6, 10]

      // E-commerce & Retail
      'https://ebay.com', // [8, 11]
      'https://walmart.com', // [8, 11]
      'https://aliexpress.com', // [11, 17]
      'https://shopee.com', // [8]
      'https://jd.com', // [8]
      'https://mercadolibre.com', // [8]
      'https://etsy.com', // [11]
      'https://bestbuy.com', // [11]
      'https://target.com', // [11]
      'https://zappos.com', // [11]
      'https://newegg.com', // [11]
      'https://asos.com', // [11]
      'https://wayfair.com', // [11]
      'https://costco.com', // [11]
      'https://wish.com', // [11]
      'https://chewy.com', // [11]
      'https://flipkart.com', // [17]
      'https://nike.com', // [20]
      'https://adidas.com',
      'https://shein.com', // [2]
      'https://temu.com', // [2]

      // News & Information
      'https://cnn.com', // [7, 31]
      'https://bbc.com', // [7]
      'https://reuters.com', // [7, 31]
      'https://nytimes.com', // [7]
      'https://foxnews.com', // [7]
      'https://cnbc.com', // [7, 31]
      'https://espn.com', // [7, 29]
      'https://huffpost.com', // [31]
      'https://washingtonpost.com', // [31]
      'https://theguardian.com',
      'https://wsj.com',
      'https://bloomberg.com', // [7]
      'https://forbes.com', // [7, 31]
      'https://businessinsider.com', // [31]
      'https://nbcnews.com', // [7, 31]
      'https://cbsnews.com', // [7, 36]
      'https://npr.org', // [7]
      'https://politico.com', // [7]
      'https://latimes.com', // [33]
      'https://usatoday.com',
      'https://time.com',

      // Tech & Software
      'https://techcrunch.com', // [3, 18, 19]
      'https://theverge.com', // [3, 18, 19]
      'https://wired.com', // [3, 18, 19]
      'https://engadget.com', // [3, 19]
      'https://gizmodo.com', // [3, 18, 19]
      'https://cnet.com', // [18, 19, 34]
      'https://techradar.com', // [3, 19]
      'https://zdnet.com', // [18, 19]
      'https://arstechnica.com', // [3, 18, 19]
      'https://pcmag.com', // [19]
      'https://macrumors.com', // [19]
      'https://androidauthority.com', // [3]
      'https://thenextweb.com', // [3, 19]
      'https://venturebeat.com', // [3, 19]
      'https://digitaltrends.com', // [3, 19]
      'https://mashable.com', // [3, 19]
      'https://anandtech.com', // [19]
      'https://howtogeek.com',
      'https://lifehacker.com',
      'https://developer.mozilla.org',

      // Streaming Services (Video & Music)
      'https://hulu.com', // [9, 21]
      'https://disneyplus.com', // [9, 21]
      'https://max.com', // Formerly HBO Max [21]
      'https://peacocktv.com', // [21]
      'https://youtubetv.com', // [21, 25]
      'https://tubitv.com', // [21]
      'https://crunchyroll.com', // [21]
      'https://paramountplus.com', // [28]
      'https://music.apple.com', // [27]
      'https://tidal.com', // [27]
      'https://qobuz.com', // [27]
      'https://pandora.com',
      'https://soundcloud.com',
      'https://vudu.com',
      'https://sling.com', // [25]

      // Other Popular & Utility Sites
      'https://adobe.com',
      'https://canva.com', // [2]
      'https://figma.com', // [2]
      'https://coursera.org',
      'https://udemy.com',
      'https://indeed.com', // Job search
      'https://glassdoor.com', // Job search
      'https://yelp.com', // Local business reviews
      'https://tripadvisor.com', // Travel reviews
      'https://booking.com', // Travel booking [2]
      'https://airbnb.com', // Accommodation booking
      'https://expedia.com', // Travel booking
      'https://kayak.com', // Travel search engine
      'https://zillow.com', // Real estate
      'https://redfin.com', // Real estate
      'https://khanacademy.org', // Education
      'https://geeksforgeeks.org', // Computer science portal
      'https://w3schools.com', // Web development tutorials
      'https://stackoverflow.com', // Already in initial list, good example
      'https://stackoverflow.com' // Placeholder for a new one, as stackoverflow was already in the initial list.
    ];

    const batchSize = 50;
    let successCount = 0;
    
    // Process in batches for better performance
    for (let i = 0; i < popularDomains.length; i += batchSize) {
      const batch = popularDomains.slice(i, i + batchSize);
      const operations = batch.map(domain => ({
        insertOne: {
          document: {
            longURL: domain,
            shortCode: generateShortCode(),
            accessCount: Math.floor(Math.random() * 100)
          }
        }
      }));
      
      try {
        const result = await Url.bulkWrite(operations, { ordered: false });
        successCount += result.insertedCount;
      } catch (error) {
        // Handle bulk write errors - some may succeed
        if (error.writeErrors) {
          successCount += operations.length - error.writeErrors.length;
        }
      }
    }
    
    console.log(`✅ Generated ${successCount} example URLs (skipped duplicates)`);
  } catch (error) {
    console.error('❌ Failed to generate examples:', error.message);
  }
}

async function devSetup(useReplica = false) {
  console.log(`🚀 Starting development setup${useReplica ? ' with replica set' : ''}...\n`);

  try {
    // 1. Setup environment
    await setupEnvironment();

    // 2. Install dependencies
    await installDependencies();

    // 3. Setup MongoDB
    const { setupMongoDB } = await import('./utils/mongodb-simple.js');
    await setupMongoDB(useReplica);

    // 4. Create admin user
    await createAdmin();

    // 5. Generate example URLs
    await generateExamples();

    // 6. Run tests
    await runTests();

    console.log('\n🎉 Development setup complete!');
    console.log('\n📋 Next steps:');
    console.log('   npm run dev    # Start development server');
    console.log('   npm test       # Run tests');
    console.log('   npm start      # Start production server');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

const useReplica = process.argv.includes('--replica');
devSetup(useReplica);