import { execSync } from 'child_process';

// Check if Artillery is installed
try {
  execSync('artillery --version', { stdio: 'ignore' });
} catch (error) {
  console.log('Artillery not found. Installing...');
  try {
    execSync('npm install -g artillery', { stdio: 'inherit' });
    console.log('✅ Artillery installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Artillery. Please install manually:');
    console.error('npm install -g artillery');
    process.exit(1);
  }
}

console.log('Starting Artillery load test...');

// Create testing-results directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
  mkdirSync('testing-results', { recursive: true });
} catch (error) {
  // Directory already exists
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const jsonReport = `testing-results/test-report-${timestamp}.json`;
const htmlReport = `testing-results/test-report-${timestamp}.html`;

// Check if server is running
try {
  execSync('curl -s http://localhost:8828/health', { stdio: 'ignore' });
  console.log('✅ Server is running');
} catch (error) {
  console.error('❌ Server not running. Please start with: npm run dev');
  process.exit(1);
}

try {
  // Run test and save JSON report
  execSync(`artillery run load-tests/load-test.yml --output ${jsonReport}`, { stdio: 'inherit' });
  
  // Generate HTML report
  execSync(`artillery report ${jsonReport} --output ${htmlReport}`, { stdio: 'inherit' });
  
  console.log('\n✅ Test completed!');
  console.log(`📊 JSON report: ${jsonReport}`);
  console.log(`📈 HTML report: ${htmlReport}`);
} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error('Make sure load-test.yml exists in tests/ directory');
  process.exit(1);
}