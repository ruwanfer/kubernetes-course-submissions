const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Respond with HTML for GET requests to /
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Todo App</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
          }
          .status {
            color: #4CAF50;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Todo Application</h1>
          <p>Welcome to the Kubernetes Course Todo App!</p>
          <p>Server is running on port: <span class="status">${PORT}</span></p>
          <p>Application started at: <span class="status">${new Date().toISOString()}</span></p>
          <p>Environment: <span class="status">${process.env.NODE_ENV || 'development'}</span></p>
        </div>
      </body>
      </html>
    `);
  } else {
    // For other routes
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Todo App API\n');
  }
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
