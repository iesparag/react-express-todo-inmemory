import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos }) {
  if (!Array.isArray(todos) || todos.length === 0) {
    return <div className="state empty">No todos yet.</div>;
  }

  // Sort by createdAt, oldest first
  const sorted = [...todos].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <ul className="todo-list">
      {sorted.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
