import React from 'react';

function TodoItem({ todo }) {
  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`.trim()}>
      <input type="checkbox" checked={!!todo.completed} readOnly disabled style={{marginRight: 8}} />
      <span className="todo-title">{todo.title}</span>
      {todo.description && <span className="todo-desc"> &mdash; {todo.description}</span>}
    </li>
  );
}

export default TodoItem;
