const http = require('http');

// Generate random string on startup
const randomString = Math.random().toString(36).substring(2, 15);
console.log("Started! Random string:", randomString);

// Output every 5 seconds
setInterval(() => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${randomString}`);
}, 5000);

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/status') {
        // Status endpoint
        const timestamp = new Date().toISOString();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            timestamp: timestamp,
            randomString: randomString,
            status: 'running'
        }));
    } else {
        // Default response
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Log Output App\nAccess /status for current status`);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
});
