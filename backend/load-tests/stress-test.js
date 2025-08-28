// Using built-in fetch instead of axios

const BASE_URL = 'http://localhost:8828';
const REQUESTS_PER_SECOND = 100;
const DURATION_SECONDS = 10;

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
  'https://amazon.com',
  'https://netflix.com',
  'https://microsoft.com',
  'https://apple.com',
  'https://wikipedia.org',
  'https://medium.com',
  'https://discord.com',
  'https://twitch.tv',
  'https://spotify.com',
  'https://dropbox.com',
  'https://zoom.us',
  'https://slack.com',
  'https://notion.so',
  'https://figma.com',
  'https://canva.com',
  'https://trello.com'
];

let shortenSuccessCount = 0;
let shortenErrorCount = 0;
let redirectSuccessCount = 0;
let redirectErrorCount = 0;
const createdShortCodes = [];

async function sendShortenRequest() {
  try {
    const randomUrl = testUrls[Math.floor(Math.random() * testUrls.length)];
    const response = await fetch(`${BASE_URL}/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ longURL: randomUrl })
    });
    
    if (response.ok) {
      const data = await response.json();
      const shortCode = data.shortURL.split('/').pop();
      createdShortCodes.push(shortCode);
      shortenSuccessCount++;
    } else {
      shortenErrorCount++;
    }
  } catch (error) {
    shortenErrorCount++;
  }
}

async function sendRedirectRequest() {
  if (createdShortCodes.length === 0) return;
  
  try {
    const randomShortCode = createdShortCodes[Math.floor(Math.random() * createdShortCodes.length)];
    const response = await fetch(`${BASE_URL}/${randomShortCode}`, {
      method: 'GET',
      redirect: 'manual' // Don't follow redirects, just check status
    });
    
    if (response.status === 302) {
      redirectSuccessCount++;
    } else {
      redirectErrorCount++;
    }
  } catch (error) {
    redirectErrorCount++;
  }
}

async function runLoadTest() {
  console.log(`Starting load test: ${REQUESTS_PER_SECOND} RPS for ${DURATION_SECONDS}s`);
  
  const startTime = Date.now();
  const endTime = startTime + (DURATION_SECONDS * 1000);
  
  while (Date.now() < endTime) {
    const promises = [];
    
    // 70% shorten requests, 30% redirect requests
    for (let i = 0; i < REQUESTS_PER_SECOND; i++) {
      if (Math.random() < 0.7) {
        promises.push(sendShortenRequest());
      } else {
        promises.push(sendRedirectRequest());
      }
    }
    
    await Promise.allSettled(promises);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`Test completed:`);
  console.log(`Shorten - Success: ${shortenSuccessCount}, Errors: ${shortenErrorCount}`);
  console.log(`Redirect - Success: ${redirectSuccessCount}, Errors: ${redirectErrorCount}`);
  console.log(`Total Success: ${shortenSuccessCount + redirectSuccessCount}`);
  console.log(`Total Errors: ${shortenErrorCount + redirectErrorCount}`);
  console.log(`Created ${createdShortCodes.length} short codes for testing`);
}

runLoadTest();