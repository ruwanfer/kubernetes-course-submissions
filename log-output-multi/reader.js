const http = require('http');
const fs = require('fs');
const url = require('url');

const LOG_FILE = '/shared-logs/log.txt';
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`Received request: ${req.method} ${pathname}`);
    
    // Handle both / and /logs prefix
    let cleanPath = pathname;
    if (pathname.startsWith('/logs')) {
        cleanPath = pathname.substring(5) || '/';
    }
    
    if (req.method === 'GET' && (cleanPath === '/' || cleanPath === '')) {
        try {
            if (fs.existsSync(LOG_FILE)) {
                const content = fs.readFileSync(LOG_FILE, 'utf8');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Log Output Application (Multi-container)\n\nRecent logs:\n${content}`);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Log Output Application (Multi-container)\n\nNo logs yet. Waiting for writer...');
            }
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Error reading logs: ${err.message}`);
        }
    } else if (req.method === 'GET' && cleanPath === '/status') {
        const timestamp = new Date().toISOString();
        const fileExists = fs.existsSync(LOG_FILE);
        const stats = fileExists ? fs.statSync(LOG_FILE) : null;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            timestamp: timestamp,
            logFileExists: fileExists,
            logFileSize: stats ? stats.size : 0,
            status: 'running'
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Not Found. Path: ${pathname}, Clean: ${cleanPath}\n`);
    }
});

server.listen(PORT, () => {
    console.log(`Reader server started on port ${PORT}`);
    console.log(`Log file path: ${LOG_FILE}`);
    console.log(`Log file exists: ${fs.existsSync(LOG_FILE)}`);
});
