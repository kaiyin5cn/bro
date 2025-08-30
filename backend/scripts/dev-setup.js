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
      password: 'admin123',
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('   Username: admin');
    console.log('   Password: admin123');
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
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing URLs, skipping example generation`);
      return;
    }
    
    const popularDomains = [
      'https://google.com', 'https://youtube.com', 'https://facebook.com',
      'https://twitter.com', 'https://instagram.com', 'https://linkedin.com',
      'https://github.com', 'https://stackoverflow.com', 'https://reddit.com',
      'https://amazon.com', 'https://netflix.com', 'https://microsoft.com',
      'https://apple.com', 'https://wikipedia.org', 'https://medium.com',
      'https://discord.com', 'https://twitch.tv', 'https://spotify.com',
      'https://dropbox.com', 'https://zoom.us'
    ];
    
    const urlsToCreate = popularDomains.map(domain => ({
      longURL: domain,
      shortCode: generateShortCode(),
      accessCount: Math.floor(Math.random() * 100)
    }));
    
    const result = await Url.insertMany(urlsToCreate);
    console.log(`✅ Generated ${result.length} example URLs`);
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