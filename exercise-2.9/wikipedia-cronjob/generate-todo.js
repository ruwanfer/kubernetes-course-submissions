const https = require('https');
const http = require('http');

// Configuration from environment variables
const BACKEND_URL = process.env.BACKEND_URL || 'http://todo-backend-service.project:3002';
const WIKI_RANDOM_URL = 'https://en.wikipedia.org/wiki/Special:Random';

// Function to get random Wikipedia URL
function getRandomWikipediaURL() {
  return new Promise((resolve, reject) => {
    const req = https.get(WIKI_RANDOM_URL, { followRedirect: false }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        const location = res.headers.location;
        if (location) {
          resolve(location);
        } else {
          reject(new Error('No location header in redirect'));
        }
      } else {
        reject(new Error(`Unexpected status code: ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Function to create todo in backend
function createTodo(text) {
  return new Promise((resolve, reject) => {
    const url = new URL(BACKEND_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: '/todos',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(JSON.stringify({ text }));
    req.end();
  });
}

// Main function
async function main() {
  try {
    console.log('Getting random Wikipedia article...');
    const wikiUrl = await getRandomWikipediaURL();
    
    console.log('Random Wikipedia URL:', wikiUrl);
    const todoText = `Read ${wikiUrl}`;
    
    console.log('Creating todo:', todoText);
    const result = await createTodo(todoText);
    
    console.log('Todo created successfully:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
