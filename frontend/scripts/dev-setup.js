import { setupEnvironment, installDependencies, runTests, verifyBackendConnection } from './utils/system-setup.js';

async function devSetup() {
  console.log('🚀 Starting frontend development setup...\n');

  try {
    // 1. Setup environment
    await setupEnvironment();

    // 2. Install dependencies
    await installDependencies();

    // 3. Verify backend connection
    await verifyBackendConnection();

    // 4. Run tests (if available)
    await runTests();

    console.log('\n🎉 Frontend setup complete!');
    console.log('\n📋 Next steps:');
    console.log('   npm run dev      # Start development server');
    console.log('   npm run build    # Build for production');
    console.log('   npm run preview  # Preview production build');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

devSetup();