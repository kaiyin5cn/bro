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

    // 5. Run tests
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