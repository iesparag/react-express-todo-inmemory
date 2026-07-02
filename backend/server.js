// Express backend for in-memory todo API
// Data is stored strictly in process memory and resets on server restart.
import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();

// ===== In-memory storage for todos =====
// This array is cleared every time the server restarts.
/**
 * @typedef {Object} Todo
 * @property {string} id - Unique string identifier
 * @property {string} title - Todo title (required)
 * @property {string} [description] - Optional description
 * @property {boolean} completed - Completion status
 * @property {string} createdAt - ISO string of creation timestamp
 */
const todos = [];

// ===== Helper: Generate RFC4122 v4-compliant UUID =====
function uuidv4() {
  // https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ===== Global Express middlewares =====
app.use(cors());
app.use(express.json());

// ===== Simple error handler helper =====
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  if (res.headersSent) return next(err);
  const code = err.status || 500;
  res.status(code).json({ error: err.message || 'Internal Server Error' });
}

// ===== Health check route =====
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Todo backend is running.' });
});

// ===== GET /todos endpoint =====
// Returns all current todos. Data is reset on server restart.
app.get('/todos', (req, res) => {
  // Respond with a deep copy to avoid accidental mutations from callers
  res.json(todos.map(todo => ({ ...todo })));
});

// ===== POST /todos endpoint =====
// Creates a new todo.
app.post('/todos', (req, res) => {
  const { title, description } = req.body || {};

  // Validate title: must be present, string, non-empty after trimming
  if (
    typeof title !== 'string' ||
    title.trim().length === 0
  ) {
    return res.status(400).json({ error: 'Missing or empty required field: title' });
  }

  // description is optional; if present, ensure it's a string
  let descStr = '';
  if (typeof description === 'undefined' || description === null) {
    descStr = '';
  } else if (typeof description === 'string') {
    descStr = description;
  } else {
    return res.status(400).json({ error: 'If provided, description must be a string' });
  }

  const now = new Date();
  const newTodo = {
    id: uuidv4(),
    title: title.trim(),
    description: descStr,
    completed: false,
    createdAt: now.toISOString()
  };
  todos.push(newTodo);
  // Respond with created resource
  res.status(201).json({ ...newTodo });
});

// ===== PUT /todos/:id endpoint =====
// Partial update of a todo (title, description, completed). All fields optional except at least one must be provided.
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Support PATCH-style: only update provided fields
  const { title, description, completed } = req.body || {};
  // If title is provided (even empty!), validate it
  if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'If provided, title must be a non-empty string' });
    }
    todo.title = title.trim();
  }

  // If description is provided
  if (Object.prototype.hasOwnProperty.call(req.body, 'description')) {
    if (typeof description !== 'string') {
      return res.status(400).json({ error: 'If provided, description must be a string' });
    }
    todo.description = description;
  }

  // If completed is provided
  if (Object.prototype.hasOwnProperty.call(req.body, 'completed')) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'If provided, completed must be a boolean' });
    }
    todo.completed = completed;
  }

  // If no updatable field was provided, return error
  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'title') &&
    !Object.prototype.hasOwnProperty.call(req.body, 'description') &&
    !Object.prototype.hasOwnProperty.call(req.body, 'completed')
  ) {
    return res.status(400).json({ error: 'Request body must include at least one field to update (title, description, completed)' });
  }

  res.status(200).json({ ...todo });
});

// ===== DELETE /todos/:id endpoint =====
// Deletes a todo by ID. Returns status or 404 if not found.
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  // Remove the todo
  const [removedTodo] = todos.splice(idx, 1);
  res.status(204).send();
  // Optionally, could return status: res.json({ message: 'Deleted', id })
});

// ===== Attach global error handler (always last) =====
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log('⚠️  All todos are stored in-memory and will RESET if the server restarts.');
});
