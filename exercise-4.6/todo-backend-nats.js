const express = require('express');
const cors = require('cors');
const { connect, StringCodec } = require('nats');

const app = express();
const PORT = process.env.PORT || 3002;
const NATS_URL = process.env.NATS_URL || 'nats://my-nats:4222';

// Middleware
app.use(cors());
app.use(express.json());

// NATS connection
let nc;
const sc = StringCodec();

async function connectNATS() {
  try {
    nc = await connect({ servers: NATS_URL });
    console.log('Connected to NATS');
  } catch (err) {
    console.error('NATS connection error:', err);
  }
}

// Initialize NATS connection
connectNATS();

// In-memory storage for todos
let todos = [
  { id: 1, text: 'Learn JavaScript', createdAt: new Date().toISOString(), done: false },
  { id: 2, text: 'Learn React', createdAt: new Date().toISOString(), done: false },
  { id: 3, text: 'Build a project', createdAt: new Date().toISOString(), done: false }
];
let nextId = 4;

// Publish todo event to NATS
async function publishTodoEvent(event, todo) {
  if (!nc) return;
  
  try {
    const message = JSON.stringify({
      event,
      todo,
      timestamp: new Date().toISOString()
    });
    
    await nc.publish('todos.events', sc.encode(message));
    console.log(`Published ${event} event for todo ${todo.id}`);
  } catch (err) {
    console.error('Failed to publish to NATS:', err);
  }
}

// GET /todos - Get all todos
app.get('/todos', (req, res) => {
  console.log('GET /todos - returning', todos.length, 'todos');
  res.json(todos);
});

// POST /todos - Create a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;
  const MAX_LENGTH = 140;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Todo text is required' });
  }

  if (text.length > MAX_LENGTH) {
    return res.status(400).json({
      error: `Todo text must be ${MAX_LENGTH} characters or less`,
      maxLength: MAX_LENGTH,
      actualLength: text.length
    });
  }

  const newTodo = {
    id: nextId++,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    done: false
  };

  todos.push(newTodo);

  // Publish event to NATS
  await publishTodoEvent('todo.created', newTodo);

  res.status(201).json(newTodo);
});

// PUT /todos/:id - Update a todo (mark as done)
app.put('/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { done } = req.body;
  
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  // Update the todo
  const updatedTodo = {
    ...todos[todoIndex],
    done: done !== undefined ? done : todos[todoIndex].done,
    updatedAt: new Date().toISOString()
  };
  
  todos[todoIndex] = updatedTodo;
  
  // Publish event to NATS
  await publishTodoEvent('todo.updated', updatedTodo);
  
  res.json(updatedTodo);
});

// Health check endpoint
app.get('/health', (req, res) => {
  const natsStatus = nc ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    nats: natsStatus,
    features: ['create_todo', 'get_todos', 'update_todo_done', 'nats_publishing']
  });
});

// Cleanup on shutdown
process.on('SIGINT', async () => {
  if (nc) {
    await nc.close();
    console.log('NATS connection closed');
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Todo backend with NATS publishing started on port ${PORT}`);
  console.log(`NATS URL: ${NATS_URL}`);
  console.log(`Publishing events to: todos.events`);
});
