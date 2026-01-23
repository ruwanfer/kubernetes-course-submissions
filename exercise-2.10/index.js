const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: duration + 'ms',
      userAgent: req.get('User-Agent') || 'unknown'
    }));
  });
  next();
});

// In-memory storage for todos (for now)
let todos = [
  { id: 1, text: 'Learn JavaScript', createdAt: new Date().toISOString() },
  { id: 2, text: 'Learn React', createdAt: new Date().toISOString() },
  { id: 3, text: 'Build a project', createdAt: new Date().toISOString() }
];
let nextId = 4;

// GET /todos - Get all todos
app.get('/todos', (req, res) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'get_todos',
    count: todos.length
  }));
  res.json(todos);
});

// POST /todos - Create a new todo
app.post('/todos', (req, res) => {
  const { text } = req.body;
  const MAX_LENGTH = 140;
  
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'create_todo_attempt',
    textLength: text ? text.length : 0,
    textPreview: text ? text.substring(0, 50) + (text.length > 50 ? '...' : '') : 'empty'
  }));
  
  if (!text || text.trim().length === 0) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: 'create_todo_rejected',
      reason: 'empty_text'
    }));
    return res.status(400).json({ error: 'Todo text is required' });
  }
  
  if (text.length > MAX_LENGTH) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: 'create_todo_rejected',
      reason: 'too_long',
      maxLength: MAX_LENGTH,
      actualLength: text.length
    }));
    return res.status(400).json({ 
      error: `Todo text must be ${MAX_LENGTH} characters or less`,
      maxLength: MAX_LENGTH,
      actualLength: text.length
    });
  }
  
  const newTodo = {
    id: nextId++,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'create_todo_success',
    todoId: newTodo.id,
    textLength: newTodo.text.length
  }));
  
  res.status(201).json(newTodo);
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'health_check'
  }));
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    maxTodoLength: 140
  });
});

app.listen(PORT, () => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'server_start',
    port: PORT,
    maxTodoLength: 140
  }));
  console.log(`Todo backend with logging started on port ${PORT}`);
  console.log(`Max todo length: 140 characters`);
});
