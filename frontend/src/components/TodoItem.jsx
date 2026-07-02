import React, { useState } from 'react';

/**
 * TodoItem component: renders a todo entry with controls to toggle, edit, and delete.
 * API errors are shown inline per-item. All controls are disabled during action in progress.
 *
 * Props:
 * - todo: { id, title, description, completed }
 * - onUpdate(todoId, changes): (Promise) called after edit/toggle
 * - onDelete(todoId): (Promise) called after delete
 */
function TodoItem({ todo, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [loadingType, setLoadingType] = useState(null); // 'toggle' | 'edit' | 'delete' | null
  const [error, setError] = useState(null);

  // When props.todo.title changes (list updated from server), update editTitle
  React.useEffect(() => {
    if (!editing) {
      setEditTitle(todo.title);
    }
  }, [todo.title, editing]);

  // Toggle the completed state
  async function handleToggleCompleted() {
    setLoadingType('toggle');
    setError(null);
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } catch (err) {
      setError(
        err?.error || err?.message || 'Failed to update completed status.'
      );
    } finally {
      setLoadingType(null);
    }
  }

  // Start editing
  function handleStartEdit() {
    setEditTitle(todo.title);
    setEditing(true);
    setError(null);
  }

  // Cancel editing
  function handleCancelEdit() {
    setEditTitle(todo.title);
    setEditing(false);
    setError(null);
  }

  // Submit edit (title update)
  async function handleEditSubmit(e) {
    e.preventDefault();
    const newTitle = editTitle.trim();
    if (!newTitle) {
      setError('Title cannot be empty.');
      return;
    }
    setLoadingType('edit');
    setError(null);
    try {
      await onUpdate(todo.id, { title: newTitle });
      setEditing(false);
    } catch (err) {
      setError(
        err?.error || err?.message || 'Failed to update title.'
      );
    } finally {
      setLoadingType(null);
    }
  }

  // Delete this todo
  async function handleDelete() {
    if (!window.confirm('Delete this todo?')) return;
    setLoadingType('delete');
    setError(null);
    try {
      await onDelete(todo.id);
    } catch (err) {
      setError(
        err?.error || err?.message || 'Failed to delete todo.'
      );
    } finally {
      setLoadingType(null);
    }
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`.trim()} style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 40 }}>
      <input
        type="checkbox"
        checked={!!todo.completed}
        onChange={handleToggleCompleted}
        disabled={!!loadingType || editing}
        style={{ marginRight: 8 }}
        aria-label={todo.completed ? 'Mark as not completed' : 'Mark as completed'}
      />

      {editing ? (
        <form onSubmit={handleEditSubmit} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            className="todo-edit-input"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            disabled={loadingType === 'edit'}
            autoFocus
            maxLength={100}
            aria-label="Edit todo title"
            style={{ flex: '1 1 auto', minWidth: 0, fontSize: '1rem' }}
          />
          <button type="submit" disabled={loadingType === 'edit'} style={{ marginRight: 2 }}>
            {loadingType === 'edit' ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={handleCancelEdit} disabled={loadingType === 'edit'}>
            Cancel
          </button>
        </form>
      ) : (
        <span className="todo-title" style={{ flex: 1, wordBreak: 'break-all' }}>
          {todo.title}
          {todo.description && <span className="todo-desc" style={{ color: '#666', fontSize: '0.96em', marginLeft: 4 }}> &mdash; {todo.description}</span>}
        </span>
      )}

      {!editing && (
        <>
          <button
            onClick={handleStartEdit}
            disabled={!!loadingType}
            title="Edit todo title"
            aria-label="Edit todo"
            style={{ marginRight: 2 }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={!!loadingType}
            title="Delete todo"
            aria-label="Delete todo"
            style={{ marginRight: 2 }}
          >
            {loadingType === 'delete' ? 'Deleting...' : 'Delete'}
          </button>
        </>
      )}
      {/* Inline loading indicator for checkbox */}
      {(loadingType === 'toggle' || loadingType === 'edit') && (
        <span style={{ color: '#888', fontSize: '0.95em', marginLeft: 6 }}>(Saving...)</span>
      )}
      {/* Show error (API error or validation), for THIS item */}
      {error && <span className="item-error" style={{ color: 'crimson', fontSize: '0.93em', marginLeft: 8, whiteSpace: 'pre-line' }}>{error}</span>}
    </li>
  );
}

export default TodoItem;
