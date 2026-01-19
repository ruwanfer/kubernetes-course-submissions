const http = require('http');
const fs = require('fs');
const path = require('path');

const COUNTER_FILE = '/shared-data/pingpong-counter.txt';
const COUNTER_DIR = '/shared-data';

// Ensure directory exists
if (!fs.existsSync(COUNTER_DIR)) {
    fs.mkdirSync(COUNTER_DIR, { recursive: true });
}

let counter = 0;

// Read existing counter if file exists
if (fs.existsSync(COUNTER_FILE)) {
    try {
        const data = fs.readFileSync(COUNTER_FILE, 'utf8');
        counter = parseInt(data.trim()) || 0;
        console.log(`Loaded counter from file: ${counter}`);
    } catch (err) {
        console.error('Error reading counter file:', err);
    }
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/pingpong') {
        counter++;
        
        // Save counter to file
        fs.writeFileSync(COUNTER_FILE, counter.toString());
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`pong ${counter}`);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found\n');
    }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Ping-pong server started on port ${PORT}`);
    console.log(`Initial counter: ${counter}`);
    console.log(`Counter file: ${COUNTER_FILE}`);
});
