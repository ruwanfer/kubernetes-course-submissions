const http = require('http');
const fs = require('fs');
const url = require('url');

const LOG_FILE = '/shared-logs/log.txt';
const COUNTER_FILE = '/shared-data/pingpong-counter.txt';
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
            let logContent = '';
            if (fs.existsSync(LOG_FILE)) {
                logContent = fs.readFileSync(LOG_FILE, 'utf8');
            }
            
            // Read ping-pong counter
            let pingPongCount = 0;
            if (fs.existsSync(COUNTER_FILE)) {
                try {
                    const counterData = fs.readFileSync(COUNTER_FILE, 'utf8');
                    pingPongCount = parseInt(counterData.trim()) || 0;
                } catch (err) {
                    console.error('Error reading counter file:', err);
                }
            }
            
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Log Output Application\n\nRecent logs:\n${logContent}Ping / Pongs: ${pingPongCount}`);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Error: ${err.message}`);
        }
    } else if (req.method === 'GET' && cleanPath === '/status') {
        const timestamp = new Date().toISOString();
        const logFileExists = fs.existsSync(LOG_FILE);
        const counterFileExists = fs.existsSync(COUNTER_FILE);
        const logStats = logFileExists ? fs.statSync(LOG_FILE) : null;
        const counterStats = counterFileExists ? fs.statSync(COUNTER_FILE) : null;
        
        let pingPongCount = 0;
        if (counterFileExists) {
            try {
                const counterData = fs.readFileSync(COUNTER_FILE, 'utf8');
                pingPongCount = parseInt(counterData.trim()) || 0;
            } catch (err) {
                console.error('Error reading counter file:', err);
            }
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            timestamp: timestamp,
            logFileExists: logFileExists,
            logFileSize: logStats ? logStats.size : 0,
            counterFileExists: counterFileExists,
            counterFileSize: counterStats ? counterStats.size : 0,
            pingPongCount: pingPongCount,
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
    console.log(`Counter file path: ${COUNTER_FILE}`);
    console.log(`Log file exists: ${fs.existsSync(LOG_FILE)}`);
    console.log(`Counter file exists: ${fs.existsSync(COUNTER_FILE)}`);
});
