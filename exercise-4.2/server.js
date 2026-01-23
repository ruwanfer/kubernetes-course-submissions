const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    // Simple health check - always returns 200 when server is running
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
