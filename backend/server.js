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

// ===== Validation middleware example (used for future endpoints) =====
function validateRequest(req, res, next) {
  // This is currently just a no-op stub for future use (POST/PUT, etc).
  next();
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

// ===== Attach global error handler (always last) =====
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log('⚠️  All todos are stored in-memory and will RESET if the server restarts.');
});
