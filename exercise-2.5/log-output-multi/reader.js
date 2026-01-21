const http = require('http');
const fs = require('fs');

const LOG_FILE = '/shared-logs/log.txt';
const PORT = process.env.PORT || 3000;
const CONFIG_FILE = '/etc/config/information.txt';

// Helper function to fetch pong count from pingpong service
async function getPongCount() {
    return new Promise((resolve) => {
        // Use hostname without protocol
        const options = {
            hostname: 'pingpong-service.exercises',
            port: 3001,
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
                resolve(data.trim());
            });
        });

        req.on('error', (err) => {
            console.error('Error fetching pong count:', err.message);
            resolve('0');
        });

        req.end();
    });
}

// Read config file
function readConfigFile() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            return fs.readFileSync(CONFIG_FILE, 'utf8').trim();
        }
        return 'Config file not found';
    } catch (err) {
        return `Error reading config: ${err.message}`;
    }
}

const server = http.createServer(async (req, res) => {
    const url = req.url;
    const pathname = url.split('?')[0];

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
            
            // Read config values
            const fileContent = readConfigFile();
            const envMessage = process.env.MESSAGE || 'MESSAGE not set';

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`file content: ${fileContent}\nenv variable: MESSAGE=${envMessage}\n${timestamp}: ${randomString}.\nPing / Pongs: ${pingPongCount}`);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Error: ${err.message}`);
        }
    } else if (req.method === 'GET' && cleanPath === '/status') {
        const timestamp = new Date().toISOString();
        const logFileExists = fs.existsSync(LOG_FILE);
        const configFileExists = fs.existsSync(CONFIG_FILE);
        const logStats = logFileExists ? fs.statSync(LOG_FILE) : null;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            timestamp: timestamp,
            logFileExists: logFileExists,
            logFileSize: logStats ? logStats.size : 0,
            configFileExists: configFileExists,
            messageEnv: process.env.MESSAGE || 'not set',
            status: 'running'
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Not Found. Path: ${pathname}\n`);
    }
});

server.listen(PORT, () => {
    console.log(`Reader server started on port ${PORT}`);
    console.log(`Config file path: ${CONFIG_FILE}`);
    console.log(`MESSAGE env: ${process.env.MESSAGE || 'not set'}`);
});
