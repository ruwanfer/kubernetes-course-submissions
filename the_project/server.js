const http = require('http');

// Get port from environment variable
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from todo app!');
});

server.listen(PORT, () => {
  // THIS IS WHAT THE EXERCISE ASKS FOR:
  console.log(`Server started in port ${PORT}`);
});
