import { execSync } from 'child_process';

console.log('Starting Artillery load test...');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const jsonReport = `testing-results/test-report-${timestamp}.json`;
const htmlReport = `testing-results/test-report-${timestamp}.html`;

try {
  // Run test and save JSON report
  execSync(`artillery run load-test.yml --output ${jsonReport}`, { stdio: 'inherit' });
  
  // Generate HTML report
  execSync(`artillery report ${jsonReport} --output ${htmlReport}`, { stdio: 'inherit' });
  
  console.log('\nTest completed!');
  console.log(`JSON report: ${jsonReport}`);
  console.log(`HTML report: ${htmlReport}`);
} catch (error) {
  console.error('Test failed:', error.message);
}