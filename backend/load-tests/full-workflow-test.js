// Full workflow test - creates URLs then tests redirects
const BASE_URL = 'http://localhost:8828';
const TOTAL_URLS = 100;
const REDIRECT_TESTS = 500;

const testUrls = [
  'https://google.com',
  'https://github.com',
  'https://stackoverflow.com',
  'https://youtube.com',
  'https://facebook.com',
  'https://twitter.com',
  'https://linkedin.com',
  'https://instagram.com',
  'https://reddit.com',
  'https://amazon.com'
];

let createdUrls = [];
let shortenStats = { success: 0, error: 0, totalTime: 0 };
let redirectStats = { success: 0, error: 0, totalTime: 0 };

async function createShortUrls() {
  console.log(`Creating ${TOTAL_URLS} short URLs...`);
  
  for (let i = 0; i < TOTAL_URLS; i++) {
    const startTime = Date.now();
    try {
      const randomUrl = testUrls[Math.floor(Math.random() * testUrls.length)] + `?test=${i}`;
      const response = await fetch(`${BASE_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longURL: randomUrl })
      });
      
      const responseTime = Date.now() - startTime;
      shortenStats.totalTime += responseTime;
      
      if (response.ok) {
        const data = await response.json();
        const shortCode = data.shortURL.split('/').pop();
        createdUrls.push({ shortCode, originalUrl: randomUrl, shortURL: data.shortURL });
        shortenStats.success++;
      } else {
        shortenStats.error++;
        console.log(`Shorten failed for ${randomUrl}: ${response.status}`);
      }
    } catch (error) {
      shortenStats.error++;
      shortenStats.totalTime += (Date.now() - startTime);
      console.log(`Shorten error: ${error.message}`);
    }
  }
}

async function testRedirects() {
  console.log(`Testing ${REDIRECT_TESTS} redirects...`);
  
  for (let i = 0; i < REDIRECT_TESTS; i++) {
    if (createdUrls.length === 0) break;
    
    const startTime = Date.now();
    try {
      const randomUrl = createdUrls[Math.floor(Math.random() * createdUrls.length)];
      const response = await fetch(`${BASE_URL}/${randomUrl.shortCode}`, {
        method: 'GET',
        redirect: 'manual'
      });
      
      const responseTime = Date.now() - startTime;
      redirectStats.totalTime += responseTime;
      
      if (response.status === 302) {
        const location = response.headers.get('location');
        if (location === randomUrl.originalUrl) {
          redirectStats.success++;
        } else {
          redirectStats.error++;
          console.log(`Redirect mismatch: expected ${randomUrl.originalUrl}, got ${location}`);
        }
      } else {
        redirectStats.error++;
        console.log(`Redirect failed: ${response.status} for ${randomUrl.shortCode}`);
      }
    } catch (error) {
      redirectStats.error++;
      redirectStats.totalTime += (Date.now() - startTime);
      console.log(`Redirect error: ${error.message}`);
    }
  }
}

async function runFullWorkflowTest() {
  console.log('Starting full workflow test...');
  const testStartTime = Date.now();
  
  // Phase 1: Create short URLs
  await createShortUrls();
  
  // Phase 2: Test redirects
  await testRedirects();
  
  const totalTestTime = Date.now() - testStartTime;
  
  // Results
  console.log('\n=== TEST RESULTS ===');
  console.log(`Total test time: ${totalTestTime}ms`);
  console.log(`Created URLs: ${createdUrls.length}`);
  
  console.log('\nSHORTEN PERFORMANCE:');
  console.log(`Success: ${shortenStats.success}`);
  console.log(`Errors: ${shortenStats.error}`);
  console.log(`Success Rate: ${((shortenStats.success / TOTAL_URLS) * 100).toFixed(2)}%`);
  console.log(`Avg Response Time: ${(shortenStats.totalTime / TOTAL_URLS).toFixed(2)}ms`);
  
  console.log('\nREDIRECT PERFORMANCE:');
  console.log(`Success: ${redirectStats.success}`);
  console.log(`Errors: ${redirectStats.error}`);
  console.log(`Success Rate: ${((redirectStats.success / REDIRECT_TESTS) * 100).toFixed(2)}%`);
  console.log(`Avg Response Time: ${(redirectStats.totalTime / REDIRECT_TESTS).toFixed(2)}ms`);
  
  console.log('\nOVERALL:');
  const totalSuccess = shortenStats.success + redirectStats.success;
  const totalRequests = TOTAL_URLS + REDIRECT_TESTS;
  console.log(`Total Success Rate: ${((totalSuccess / totalRequests) * 100).toFixed(2)}%`);
  console.log(`Overall RPS: ${(totalRequests / (totalTestTime / 1000)).toFixed(2)}`);
}

runFullWorkflowTest();