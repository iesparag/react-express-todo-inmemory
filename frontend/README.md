# Todo Frontend (React + Vite)

This is the frontend React SPA for the in-memory todo app.

## Requirements
- Node.js v18 or newer

## Install & Run (Dev Mode)

```sh
cd frontend
npm install
npm run dev
```

Frontend runs on [http://localhost:5173](http://localhost:5173) by default.

## Build for Production

```sh
npm run build
npm run preview
```

- `npm run build`: Compiles static files to `dist/`
- `npm run preview`: Serves build output on a local server

## Notes
- The backend API is expected at `http://localhost:3000` (configurable, update in API helpers as the app evolves).
- Data stored on the backend is **not** persisted—todos will reset on any server restart.
