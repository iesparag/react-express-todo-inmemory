import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos }) {
  if (!todos || todos.length === 0) {
    return <div style={{ color: '#888', marginTop: 18 }}>No todos yet &mdash; add your first above!</div>;
  }
  return (
    <ul className="todo-list" style={{ listStyle: 'none', padding: 0, marginTop: 10 }}>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
