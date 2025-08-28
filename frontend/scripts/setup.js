import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, copyFileSync } from 'fs';

const execAsync = promisify(exec);

async function setup() {
  console.log('🚀 Starting frontend setup...\n');

  try {
    // 1. Setup environment
    if (!existsSync('.env')) {
      copyFileSync('.env.example', '.env');
      console.log('✅ Created .env from .env.example');
    }

    // 2. Install dependencies
    console.log('📦 Installing dependencies...');
    await execAsync('npm install');
    console.log('✅ Dependencies installed');

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

setup();