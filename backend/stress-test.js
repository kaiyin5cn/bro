import axios from 'axios';

const BASE_URL = 'http://localhost:8828';
const REQUESTS_PER_SECOND = 1000;
const DURATION_SECONDS = 10;

const testUrls = [
  'https://google.com',
  'https://github.com',
  'https://stackoverflow.com',
  'https://youtube.com',
  'https://facebook.com'
];

let successCount = 0;
let errorCount = 0;

async function sendRequest() {
  try {
    const randomUrl = testUrls[Math.floor(Math.random() * testUrls.length)];
    await axios.post(`${BASE_URL}/shorten`, { longURL: randomUrl });
    successCount++;
  } catch (error) {
    errorCount++;
  }
}

async function runLoadTest() {
  console.log(`Starting load test: ${REQUESTS_PER_SECOND} RPS for ${DURATION_SECONDS}s`);
  
  const startTime = Date.now();
  const endTime = startTime + (DURATION_SECONDS * 1000);
  
  while (Date.now() < endTime) {
    const promises = [];
    for (let i = 0; i < REQUESTS_PER_SECOND; i++) {
      promises.push(sendRequest());
    }
    await Promise.allSettled(promises);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`Test completed:`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total: ${successCount + errorCount}`);
}

runLoadTest();