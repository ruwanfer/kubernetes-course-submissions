const fs = require('fs');
const path = require('path');

const LOG_FILE = '/shared-logs/log.txt';
const LOG_DIR = '/shared-logs';

// Create directory if not exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Generate random string on startup
const randomString = Math.random().toString(36).substring(2, 15);
console.log(`Writer started. Random string: ${randomString}`);

// Write to file every 5 seconds
setInterval(() => {
    const timestamp = new Date().toISOString();
    const logLine = `${timestamp}: ${randomString}\n`;
    
    fs.appendFile(LOG_FILE, logLine, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log(`Wrote: ${logLine.trim()}`);
        }
    });
}, 5000);

// Keep process alive
process.stdin.resume();
