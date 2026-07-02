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
- The backend API is expected at `http://localhost:3000` in local development.
- **Set the API base URL** with `VITE_API_URL` environment variable (e.g., your deployed backend on Railway).
- Data stored on the backend is **not** persisted—todos will reset on any server restart.

## Usage Note

:warning: **Data is stored in-memory only and will reset if the backend server restarts.**

## Deployment

### Deploy with Vercel (One-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iesparag/react-express-todo-inmemory&root-directory=frontend)

#### Steps
1. Click the button and select your GitHub account.
2. Enter your deployed backend URL as `VITE_API_URL` (e.g., `https://<your-backend>.up.railway.app`).
3. Deploy!

### Environment Variables

- `VITE_API_URL` (required on production): The base URL to your backend API (e.g., `https://<your-backend>.up.railway.app`).
  - On local dev, defaults to `http://localhost:3000` if unset.

## Vercel Configuration
- The app is configured for **SPA** rewrites using `vercel.json`.
