# Todo Backend (Express, In-memory)

This is the backend for the in-memory React todo app.

## Requirements
- Node.js v18 or newer

## Install & Run

```sh
cd backend
npm install
npm start
```

By default, the server runs on [http://localhost:3000](http://localhost:3000), but you can override the port with:

```sh
PORT=4000 npm start
```

## Endpoints

- `GET /` — returns `{ status: 'ok', message: ... }` (server health check)
- (Other todo endpoints to be added next)

## Tests

_No test files yet. To add Node.js tests, use the `node --test` runner and place `.test.js` files as needed._
