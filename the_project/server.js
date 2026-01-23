const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || process.env.FRONTEND_PORT || 3000;

// Read HTML template
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'public', 'index.template.html'), 'utf8');

// Replace placeholders with environment variables
const html = htmlTemplate
  .replace('{{API_BASE_URL}}', process.env.API_BASE_URL || 'http://todo-backend-service.project:3002')
  .replace('{{MAX_TODO_LENGTH}}', process.env.MAX_TODO_LENGTH || '140')
  .replace('{{FRONTEND_PORT}}', PORT);

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.method === 'GET' && req.url === '/config') {
    // Config endpoint for debugging
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      API_BASE_URL: process.env.API_BASE_URL,
      MAX_TODO_LENGTH: process.env.MAX_TODO_LENGTH,
      FRONTEND_PORT: process.env.FRONTEND_PORT,
      PORT: PORT
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Configurations:`);
  console.log(`  API_BASE_URL: ${process.env.API_BASE_URL || 'not set'}`);
  console.log(`  MAX_TODO_LENGTH: ${process.env.MAX_TODO_LENGTH || '140 (default)'}`);
  console.log(`  FRONTEND_PORT: ${process.env.FRONTEND_PORT || 'not set'}`);
});
