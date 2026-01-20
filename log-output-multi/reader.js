const http = require('http');
const fs = require('fs');
const url = require('url');

const LOG_FILE = '/shared-logs/log.txt';
const PORT = process.env.PORT || 3000;

// Helper function to fetch pong count from pingpong service
async function getPongCount() {
    return new Promise((resolve) => {
        // In Docker Compose: use service name "pingpong"
        // In Kubernetes: will use service name "pingpong-service"
        const hostname = process.env.PINGPONG_SERVICE_HOST || 'pingpong';
        const port = process.env.PINGPONG_SERVICE_PORT || '3001';
        
        console.log(`Fetching pong count from ${hostname}:${port}`);
        
        const options = {
            hostname: hostname,
            port: port,
            path: '/count',
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`Received pong count: ${data.trim()}`);
                resolve(data.trim());
            });
        });

        req.on('error', (err) => {
            console.error('Error fetching pong count:', err.message);
            resolve('0'); // Default to 0 if error
        });

        req.end();
    });
}

const server = http.createServer(async (req, res) => {
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
            let logContent = '';
            if (fs.existsSync(LOG_FILE)) {
                logContent = fs.readFileSync(LOG_FILE, 'utf8');
            }

            // Get ping-pong count via HTTP
            const pingPongCount = await getPongCount();
            const timestamp = new Date().toISOString();
            const randomString = Math.random().toString(36).substring(2, 15);

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`${timestamp}: ${randomString}.\nPing / Pongs: ${pingPongCount}`);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Error: ${err.message}`);
        }
    } else if (req.method === 'GET' && cleanPath === '/status') {
        const timestamp = new Date().toISOString();
        const logFileExists = fs.existsSync(LOG_FILE);
        const logStats = logFileExists ? fs.statSync(LOG_FILE) : null;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            timestamp: timestamp,
            logFileExists: logFileExists,
            logFileSize: logStats ? logStats.size : 0,
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
});
