import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, copyFileSync } from 'fs';

const execAsync = promisify(exec);

export async function setupEnvironment() {
  if (!existsSync('.env')) {
    copyFileSync('.env.example', '.env');
    console.log('✅ Created .env from .env.example');
  }
}

export async function installDependencies() {
  console.log('📦 Installing dependencies...');
  try {
    await execAsync('npm install');
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.log('❌ Dependency installation failed:', error.message);
    process.exit(1);
  }
}

export async function runTests() {
  console.log('🧪 Running tests...');
  try {
    await execAsync('npm test');
    console.log('✅ All tests passed');
  } catch (error) {
    console.log('⚠️  Some tests failed:', error.message);
    console.log('   Continuing setup despite test failures...');
  }
}