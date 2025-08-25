import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { setupReplicaSet, createDatabaseUser } from './utils/mongodb-setup.js';
import { setupEnvironment, installDependencies, runTests } from './utils/system-setup.js';

async function devSetup(useReplica = false) {
  console.log(`🚀 Starting development setup${useReplica ? ' with replica set' : ''}...\n`);

  try {
    // 1. Setup environment
    await setupEnvironment();
    dotenv.config();

    // 2. Install dependencies
    await installDependencies();

    // 3. Setup MongoDB
    let mongoUri = process.env.MONGODB_ADMIN_URI || 'mongodb://localhost:27017';
    
    if (useReplica) {
      mongoUri = await setupReplicaSet();
    }
    
    console.log('🔌 Checking MongoDB connection...');
    const client = new MongoClient(mongoUri);
    
    try {
      await client.connect();
      console.log('✅ MongoDB connection successful');

      // 4. Create database user
      const dbName = process.env.DB_NAME || 'urlshortener';
      const appUser = process.env.DB_USER || 'urlapp';
      const appPassword = process.env.DB_PASSWORD || 'securepassword123';
      
      await client.close();
      await createDatabaseUser(mongoUri, dbName, appUser, appPassword);
      console.log('✅ Database setup complete (indexes handled by Mongoose)');

    } catch (error) {
      console.log('⚠️  MongoDB not running or not accessible');
      console.log('   Please start MongoDB and run: npm run setup');
      return;
    }

    // 5. Run tests
    await runTests();

    console.log('\n🎉 Development setup complete!');
    console.log('\n📋 Next steps:');
    console.log('   npm run dev    # Start development server');
    console.log('   npm test       # Run tests');
    console.log('   npm start      # Start production server');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Check command line arguments
const useReplica = process.argv.includes('--replica');
devSetup(useReplica);