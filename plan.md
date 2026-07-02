# Build plan

## Build Plan

1. **Setup project structure and dependencies**
   - Initialize backend and frontend folders with package.json, basic config, README, and gitignore files.

2. **Backend: Implement GET /todos endpoint with in-memory storage**
   - Create empty todos array in memory.
   - Implement GET /todos returning current todos.
   - Test with curl or Postman.

3. **Backend: Implement POST /todos to add todo with validation**
   - Validate title is required.
   - Generate UUID, add timestamps.
   - Respond with created todo.

4. **Backend: Implement PUT /todos/:id and DELETE /todos/:id for update and delete**
   - Validate id existence.
   - Allow update of title, description, completed.
   - Return 404 if id not found.

5. **Frontend: Setup React with Vite and fetch/display todos on mount**
   - Render list or message if empty.
   - Show loading and error states.
   - Display note about data reset.

6. **Frontend: Add todo form to create new todos via POST**
   - Inputs for title (required) and description.
   - Submit form calls backend.
   - Update UI after success.

7. **Frontend: Todo item controls for toggle complete, edit title, delete**
   - Checkbox toggles completed state via PUT.
   - Inline edit for title updates via PUT.
   - Delete button removes todo via DELETE.
   - Reflect API responses in UI.

8. **Deployment configuration and final README update**
   - Add Railway config for backend.
   - Add Vercel config for frontend.
   - Document env var usage and deployment steps.

Each issue will implement backend API and frontend UI parts required for the feature end-to-end.
