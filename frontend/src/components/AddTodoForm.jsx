import React, { useState } from 'react';

// API base URL - should match backend. Could import from api/ later.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    // Client-side validation: title is required
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim() })
      });
      if (!response.ok) {
        // Try to parse JSON error from backend
        let errMsg = 'Failed to add todo.';
        try {
          const errData = await response.json();
          if (errData && errData.error) errMsg = errData.error;
        } catch { /* keep generic */ }
        setError(errMsg);
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (onAdd) onAdd(data);
      setTitle('');
      setDescription('');
      setError(null);
    } catch (err) {
      setError('Network error - failed to add todo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="add-todo-form" onSubmit={handleSubmit} autoComplete="off" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="text"
          className="input-title"
          placeholder="Todo title *"
          value={title}
          onChange={e => setTitle(e.target.value)}
          aria-label="Todo title"
          disabled={loading}
          maxLength={100}
          required
        />
        <textarea
          className="input-desc"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          aria-label="Todo description"
          disabled={loading}
          rows={2}
          maxLength={500}
        />
        <button
          type="submit"
          className="btn-add-todo"
          disabled={loading}
          style={{ alignSelf: 'flex-start' }}
        >
          {loading ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
      {error && (
        <div className="error-msg" role="alert" style={{ color: 'red', marginTop: 8 }}>
          {error}
        </div>
      )}
    </form>
  );
}
