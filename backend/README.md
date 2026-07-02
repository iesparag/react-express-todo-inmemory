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
- `GET /todos` — returns an array of all todos
- `POST /todos` — create a new todo, with JSON body `{ title: string, description?: string }`
    - Returns the created todo (201), or 400 on invalid input

## Example POST /todos Usage

Create a todo with curl:

```sh
curl -X POST http://localhost:3000/todos \
  -H 'Content-Type: application/json' \
  -d '{"title": "My first todo"}'
```

Invalid/no title returns 400:

```sh
curl -X POST http://localhost:3000/todos -H 'Content-Type: application/json' -d '{}'
```

## Tests

_No test files yet. To add Node.js tests, use the `node --test` runner and place `.test.js` files as needed._
