# Architecture

### Components
- **Backend**: Express server holding an in-memory array of todo objects with fields (id, title, description, completed, createdAt). Provides REST API routes (/todos GET, POST; /todos/:id PUT, DELETE) with input validation and CORS enabled.
- **Frontend**: React SPA created with Vite, fetches todos from backend on mount, renders list with add form, editing inline, toggle complete checkbox, delete buttons.

### Folder Structure
```
/backend
  ├── server.js
  ├── package.json
  ├── README.md
  ├── .gitignore
/frontend
  ├── src/
  │   ├── main.jsx
  │   ├── App.jsx
  │   ├── components/
  │   │    ├── AddTodoForm.jsx
  │   │    ├── TodoList.jsx
  │   │    ├── TodoItem.jsx
  ├── index.html
  ├── vite.config.js
  ├── package.json
  ├── README.md
  ├── styles.css
  ├── .gitignore
```

### Data Flow
- React fetches `/todos` on App mount, stores in local state.
- User actions trigger REST API calls; UI updates on success.
- Refresh frontend re-fetches data to maintain state.
- Restarting backend clears all todos (in-memory reset).

### Key decisions
- Use UUID for todo ids.
- Express middlewares: CORS, JSON parser.
- Frontend API base URL configurable via env variable.
- Minimal styling for clarity and responsiveness.

