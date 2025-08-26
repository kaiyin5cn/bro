import { setupEnvironment, installDependencies, runTests } from './utils/system-setup.js';

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

    // 4. Run tests
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