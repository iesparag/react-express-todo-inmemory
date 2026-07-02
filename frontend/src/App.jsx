import React, { useState, useEffect } from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch todos on mount
  useEffect(() => {
    async function fetchTodos() {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`${API_BASE}/todos`);
        if (!res.ok) throw new Error('Server error');
        const data = await res.json();
        setTodos(data);
      } catch (e) {
        setFetchError('Failed to load todos. The backend may be down.');
      } finally {
        setLoading(false);
      }
    }
    fetchTodos();
  }, []);

  // Handler to add new todo to state when successfully created via AddTodoForm
  function handleAddTodo(newTodo) {
    setTodos(todos => [...todos, newTodo]);
  }

  return (
    <div className="main-container" style={{ maxWidth: 520, margin: '35px auto', padding: 24, background: '#fff', borderRadius: 10, boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
      <h1 className="app-title" style={{ marginBottom: 12, fontWeight: 700, fontSize: 28 }}>
        In-memory Todo App
      </h1>
      <p style={{ fontSize: 14, marginBottom: 32, color: '#555' }}>
        Simple todos — <span style={{ fontWeight: 500 }}>Data is temporary and will reset if the server restarts.</span>
      </p>
      <AddTodoForm onAdd={handleAddTodo} />
      {loading ? (
        <div style={{ marginTop: 32, textAlign: 'center', color: '#777' }}>Loading todos...</div>
      ) : fetchError ? (
        <div role="alert" style={{ color: 'red', marginTop: 32 }}>{fetchError}</div>
      ) : (
        <TodoList todos={todos} />
      )}
    </div>
  );
}

export default App;
