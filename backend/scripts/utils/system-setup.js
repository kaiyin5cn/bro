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
  await execAsync('npm install');
  console.log('✅ Dependencies installed');
}

export async function runTests() {
  console.log('🧪 Running tests...');
  await execAsync('npm test');
  console.log('✅ All tests passed');
}