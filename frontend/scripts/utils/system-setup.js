import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import http from 'http';

const execAsync = promisify(exec);

export async function setupEnvironment() {
  console.log('🔧 Setting up environment...');
  
  try {
    await fs.access('.env');
    console.log('✅ .env file already exists');
  } catch {
    try {
      const envExample = await fs.readFile('.env.example', 'utf8');
      await fs.writeFile('.env', envExample);
      console.log('✅ Created .env from .env.example');
    } catch (error) {
      console.log('⚠️  No .env.example found, creating basic .env');
      const basicEnv = `VITE_API_BASE_URL=http://localhost:8828\nPORT=5173`;
      await fs.writeFile('.env', basicEnv);
      console.log('✅ Created basic .env file');
    }
  }
}

export async function installDependencies() {
  console.log('📦 Installing dependencies...');
  
  try {
    const { stdout } = await execAsync('npm install');
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error.message}`);
  }
}

export async function runTests() {
  console.log('🧪 Running tests...');
  
  try {
    await fs.access('src');
    console.log('✅ Source directory verified');
    console.log('⚠️  No test script configured, skipping tests');
  } catch (error) {
    console.log('⚠️  Source directory not found, skipping tests');
  }
}

export async function verifyBackendConnection() {
  console.log('🔌 Verifying backend connection...');
  
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8828', (res) => {
      console.log('✅ Backend connection successful');
      resolve();
    });
    
    req.on('error', () => {
      console.log('⚠️  Backend not accessible - make sure it\'s running');
      console.log('   Run: cd ../backend && npm run setup && npm run dev');
      resolve();
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log('⚠️  Backend connection timeout');
      resolve();
    });
  });
}