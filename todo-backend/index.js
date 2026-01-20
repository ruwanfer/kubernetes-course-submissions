const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for todos
let todos = [
  { id: 1, text: 'Learn JavaScript', createdAt: new Date().toISOString() },
  { id: 2, text: 'Learn React', createdAt: new Date().toISOString() },
  { id: 3, text: 'Build a project', createdAt: new Date().toISOString() }
];
let nextId = 4;

// GET /todos - Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST /todos - Create a new todo
app.post('/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Todo text is required' });
  }
  
  if (text.length > 140) {
    return res.status(400).json({ error: 'Todo text must be 140 characters or less' });
  }
  
  const newTodo = {
    id: nextId++,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Todo backend service running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /todos - Get all todos`);
  console.log(`  POST /todos - Create new todo`);
  console.log(`  GET  /health - Health check`);
});
