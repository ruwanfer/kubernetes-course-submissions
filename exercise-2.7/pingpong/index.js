const http = require('http');

let counter = 0;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/pingpong') {
        counter++;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`pong ${counter}`);
    } else if (req.method === 'GET' && req.url === '/count') {
        // Return counter as plain text (not JSON) for easier parsing
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(counter.toString());
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found\n');
    }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Ping-pong server started on port ${PORT}`);
});
