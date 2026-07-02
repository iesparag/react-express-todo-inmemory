# Design analysis

# Rigorous Design Analysis for Full-stack Todo App (React + Express, In-memory Storage)

---

## 1. Restated Requirements, Project Type, and Assumptions

**Project type:**  
Full-stack web application with a React frontend (using Vite as build tool) and Node.js + Express backend. The data layer is purely in-memory JS data structures (array/object), so data resets on backend restart.

**Restated requirements:**  
- Store todos entirely in-memory on the backend (array of todo objects). No external persistence.
- Backend exposes a REST API with routes:  
  - GET `/todos`: returns all todos  
  - POST `/todos`: create todo (with title and optional description)  
  - PUT `/todos/:id`: update any field (title/description/completed)  
  - DELETE `/todos/:id`: remove todo  
- Frontend uses React (via Vite) with a minimal, clean, responsive UI that:  
  - On mount, fetches todos from backend and lists them  
  - Form to add new todo (title required, description optional)  
  - Each item has controls to toggle completion, edit title, and delete  
  - Show a footer/note: "Data is temporary and will reset if the server restarts"  
- Folder structure separated into `/backend` and `/frontend`  
- README with instructions for running both parts  
- Testing goals:  
  - Correct state persistence while backend runs (all CRUD ops work)  
  - Refresh frontend page without losing data (reload from backend)  
  - Resetting backend clears all todos (in-memory clear)  

**Assumptions:**  
- Todo `id` will be a simple unique identifier generated in backend (e.g., UUID or incrementing integer)  
- Title is mandatory; description is optional empty string if omitted  
- Marking complete/incomplete toggles boolean flag `completed`  
- Editing refers to updating the title only (optional: can extend to description)  
- Frontend updates UI optimistically or after server confirmation (prefer server confirmation for simplicity and correctness)  
- No user authentication or multi-user support; all todos shared across session  
- No need for pagination or filtering, since test app and in-memory storage only  
- Backend runs on fixed port (e.g., 3000), frontend on another (e.g., 5173) with CORS enabled for dev  
- Sufficient inline comments and doc comments explaining "data resets on restart"  


---

## 2. Core Domain Entities and Data Model

### Todo Entity

| Field         | Type    | Description                                    | Constraints                          |
|---------------|---------|------------------------------------------------|------------------------------------|
| id            | string  | Unique identifier for a todo                    | Must be unique within app instance |
| title         | string  | Short text title of the todo                     | Required, non-empty                 |
| description   | string  | Optional longer description                      | Optional, default empty string     |
| completed     | boolean | Status indicating if todo is completed or not   | Default: false                     |
| createdAt     | Date    | Timestamp for when the todo was created          | Optional, useful for UI ordering   |

- Stored as plain JS objects inside an in-memory array on backend.
- `id` could be a UUID string (recommended for safety), or auto-incrementing number.
- `createdAt` not strictly required but aids in UI sorting "oldest first" or "newest first".

---

## 3. Architecture and Folder Structure

```
/backend
  ├── server.js        # Main Express server, REST API routes, in-memory storage
  ├── package.json
  ├── README.md        # Instructions to install & start backend
/frontend
  ├── src
  │   ├── App.jsx     # React root component
  │   ├── components
  │   │   ├── TodoList.jsx
  │   │   ├── TodoItem.jsx
  │   │   ├── AddTodoForm.jsx
  │   └── main.jsx    # React entry point rendered by Vite
  ├── index.html       # Base HTML
  ├── package.json
  ├── vite.config.js    # Vite configuration
  ├── README.md        # Instructions to install & start frontend
  └── styles.css       # Optional basic styling
```

### Data Flow

- Frontend loads → React mounts → fetches GET `/todos` → populates local state (React `useState`)
- User adds/edits/deletes/toggles → frontend sends REST API request → backend updates in-memory array and responds with updated todo or status → frontend updates UI accordingly
- Refresh frontend → repeat fetch `/todos`, restores UI list
- Backend restart → in-memory array is reset to empty → frontend reload shows empty list

---

## 4. Key User Flows and API Surface

### API Endpoints

| Verb   | Route        | Request Body                          | Response                      | Description                           |
|--------|--------------|-------------------------------------|-------------------------------|-------------------------------------|
| GET    | `/todos`     | None                                | JSON array of all todos       | Fetch all todos                      |
| POST   | `/todos`     | `{ title: string, description?: string }` | Newly created todo object    | Add new todo                        |
| PUT    | `/todos/:id` | `{ title?, description?, completed? }` | Updated todo object           | Update existing todo                |
| DELETE | `/todos/:id` | None                                | Success message or deleted todo id | Delete todo by id               |

---

### User Flows

#### 1. View Todos on Page Load
- React app mounts → fetch `/todos` → render list  
- If empty, show "No todos yet" message  

#### 2. Add New Todo
- User types title (required) and description (optional)  
- Submits form → POST `/todos`  
- On success, todo appended to current list in UI

#### 3. Toggle Complete/Incomplete
- User clicks checkbox on todo → PUT `/todos/:id` with toggled `completed` boolean  
- On success, UI updates checked state

#### 4. Edit Todo Title
- User clicks edit button → UI input field appears or inline editable field  
- User submits edit → PUT `/todos/:id` (only title changed)  
- On success, UI updates title

#### 5. Delete Todo
- User clicks delete button → DELETE `/todos/:id`  
- On success, todo removed from UI list

#### 6. Frontend Note
- Always visible small text:  
  > "Data is temporary and will reset if the server restarts"

---

## 5. Edge Cases, Failure Modes, and Handling

### Backend Edge Cases
- PUT/DELETE with unknown/non-existent `id` → respond 404 Not Found  
- POST with missing or empty `title` → respond 400 Bad Request  
- PUT with empty title → reject if title is empty string  
- Backend server crash → in-memory data lost (expected)

### Frontend States

| State      | Description                                      | UX Considerations                                      |
|------------|-------------------------------------------------|-------------------------------------------------------|
| Loading    | Fetching todos from backend on mount             | Show spinner or "Loading..."                           |
| Empty      | No todos returned                                | Show friendly message "No todos yet - add one above"  |
| Error      | Backend API request fails (network/server down) | Show error message "Failed to load todos. Try refresh"|
| Updating   | Awaiting response from API for add/edit/delete  | Disable form/buttons or show small loading indicator  |
| Idle       | Ready for user input                             | Normal UI                                              |

### Failure Handling

- Frontend retries generally not required; just inform user on failure  
- Server logs errors in console with meaningful messages  
- Backend input validation errors return JSON error messages with proper HTTP codes  

---

## 6. Security, Validation, and Configuration

**Security:**  
- No authentication needed (simple test app)  
- Enable CORS on backend to allow requests from dev frontend port  
- Sanitize inputs (minimal, no XSS mitigation needed here, but frontend escapes content when rendering)  
- No rate limiting (not required)  

**Validation:**  
- Backend validates required `title` field presence and non-empty string  
- Backend validates `completed` field boolean in PUT  
- Backend checks `:id` format and existence before update/delete  

**Configuration:**  
- Backend listen port fixed or via env var (default 3000)  
- Frontend base URL for API configurable (default http://localhost:3000)  
- README documents how to run both parts with npm scripts  
- `package.json` includes proper dependencies and scripts:  
  - backend: `npm start` (for node server.js)  
  - frontend: `npm run dev` (vite dev server)  

---

## 7. Testing Strategy

### Backend

- Unit test functions manipulating in-memory array (optional but could be included)  
- Integration tests for API endpoints using a test framework like Jest + supertest:  
  - POST /todos creates a todo  
  - GET /todos returns created todos  
  - PUT /todos/:id updates a todo field  
  - DELETE /todos/:id deletes it  
  - Verify 404 for invalid IDs  
  - Validate error for missing title in POST  

### Frontend

- Minimal automated tests (optional):  
  - Basic smoke test that app builds cleanly (Vite build passes with no warnings/errors)  
- Manual testing steps documented in README:  
  - Add/edit/delete todos via UI  
  - Reload frontend page, confirm todos persist  
  - Restart backend, confirm todos reset  

---

## 8. Incremental Build Approach

### Step 1: Backend Basic Setup and GET /todos  
- Initialize Express app with empty in-memory array and GET endpoint  
- Server listens on port 3000  
- Manual curl test for GET returns `[]` initially  
- Add README with backend run steps  

### Step 2: Backend POST /todos (Create)  
- Add POST route handling input, validate title, create todo with ID, timestamp, etc.  
- Verify new todos appear in GET  
- Add error handling for missing title  

### Step 3: Backend PUT /todos/:id (Update) and DELETE /todos/:id  
- Implement update logic, support partial fields  
- Implement delete logic  
- Return proper status codes for invalid IDs  

### Step 4: Frontend Setup and Fetch Todos  
- Initialize React with Vite project  
- Setup fetch from backend on mount, display list (empty at first)  
- Basic UI shell and note on data reset  

### Step 5: Frontend Add Todo Form  
- Form with title + description inputs and add button  
- POST on submit to backend  
- Render new todo in list on success  

### Step 6: Frontend Todo Item Controls (Toggle, Edit, Delete)  
- Checkbox toggle sends PUT requests  
- Edit button toggles inline editing of title with PUT  
- Delete button sends DELETE request; remove from UI  

### Step 7: UI polishing and states  
- Loading indicators  
- Empty and error states messages  
- Responsive CSS styling  

### Step 8: Documentation and Final Testing  
- Write full README instructions for both backend and frontend  
- Manual testing of persistence during session, page reload, backend reset  
- Optional: add backend API tests with Jest

---

This completes the detailed design analysis respecting the user brief precisely, preparing for concrete implementation without extraneous features.
