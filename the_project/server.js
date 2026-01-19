const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Serve index.html for all routes
  if (req.method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // File not found
          res.writeHead(404);
          res.end('File not found');
        } else {
          // Server error
          res.writeHead(500);
          res.end('Server error: ' + err.code);
        }
      } else {
        // Success
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else {
    // For other methods
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed\n');
  }
});

server.listen(PORT, () => {
  console.log(`Todo App server running on port ${PORT}`);
});
