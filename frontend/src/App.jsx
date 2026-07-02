import React, { useEffect, useState } from 'react';
import TodoList from './components/TodoList';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchTodos() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`${API_BASE_URL}/todos`);
        if (!resp.ok) {
          throw new Error(`Server returned ${resp.status}`);
        }
        const data = await resp.json();
        if (isMounted) {
          setTodos(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load todos. Please try refreshing.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchTodos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container">
      <header>
        <h1>In-memory Todo App</h1>
      </header>
      <main>
        {loading ? (
          <div className="state loading">Loading todos...</div>
        ) : error ? (
          <div className="state error">{error}</div>
        ) : (
          <TodoList todos={todos} />
        )}
        <div className="note" data-testid="persistence-note">
          Data is <b>temporary</b> and will reset if the server restarts.
        </div>
      </main>
    </div>
  );
}

export default App;
