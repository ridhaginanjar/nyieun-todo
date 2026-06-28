# NyieunTudu Improvement Roadmap

This roadmap is written for your current state: a static todo app built with `index.html`, `css/style.css`, and an empty or early `js/main.js`. The goal is to grow it step by step into a real personal app while learning the full web development path: frontend, backend, database, authentication, deployment, monitoring, and maintenance.

## Current Baseline

- Static HTML layout for a todo dashboard.
- CSS design tokens and desktop layout already started.
- Hardcoded todo examples in the markup.
- Form UI exists, but task creation is not yet connected to JavaScript state.
- Tabs, edit, delete, checkbox, dark theme, and persistence are not fully implemented yet.
- Mobile support is currently blocked instead of responsive.

## Phase 1: Frontend Foundations

Focus: make the current static page behave like an actual app in the browser.

### 1. Connect The Form To JavaScript (DONE)

- Capture form submission with `addEventListener`.
- Read task name, deadline, and priority from the form.
- Validate empty task names before creating a task.
- Reset the form after successful submission.
- Prevent page reload with `event.preventDefault()`.

Learning goal: DOM events, form handling, validation, and browser default behavior.

### 2. Create A Task Data Model  (DONE)

- Represent every task as an object:

```js
{
  id: "unique-id",
  title: "Learn DOM",
  deadline: "2026-06-20",
  priority: "High",
  completed: false,
  createdAt: "2026-06-18T10:00:00.000Z",
  updatedAt: "2026-06-18T10:00:00.000Z"
}
```

- Store all tasks inside an array.
- Render the UI from the array instead of hardcoded HTML.

Learning goal: state, arrays, objects, rendering, and separating data from UI.

### 3. Render Tasks Dynamically (DONE)

- Replace hardcoded task list items with JavaScript-generated elements.
- Show an empty state when there are no tasks.
- Format the deadline into a readable date.
- Show different priority colors for High, Medium, and Low.

Learning goal: DOM creation, template functions, conditional rendering, and UI states.

### 4. Implement Todo Actions (DONE)

- Complete or uncomplete a task using the checkbox.
- Delete a task.
- Edit a task title, deadline, and priority. (NOT PRIORITY)
- Confirm before deleting if you want safer behavior.

Learning goal: event delegation, updating state, and keeping UI synchronized with data.

### 5. Fix Filtering Tabs (DONE)

- Make tabs actually filter tasks:
  - All
  - Active
  - Completed
- Fix naming: the current `Success` tab likely should be `Active` or `Pending`.
- Update `aria-selected` correctly when switching tabs.

Learning goal: UI state, accessibility attributes, and conditional views.

### 6. Add Local Storage Persistence (DONE)

- Save tasks to `localStorage` after create, edit, complete, and delete.
- Load tasks from `localStorage` when the page opens.
- Handle invalid or missing saved data gracefully.

Learning goal: browser storage, JSON serialization, and data recovery.

### 7. Improve Responsive Design (NOT PRIORITY)

- Remove the desktop-only media blocker.
- Make the layout usable on mobile, tablet, and desktop.
- Convert the form grid into a single column on small screens.
- Make task rows stack cleanly on mobile.
- Test with browser devtools at common widths: 360px, 768px, 1024px, and desktop.

Learning goal: responsive CSS, media queries, flexible layouts, and mobile-first thinking.

### 8. Improve Accessibility (NOT PRIORITY)

- Add real `href` values or use buttons for navigation-like controls.
- Ensure every interactive element has a clear label.
- Add visible focus states.
- Make custom checkboxes keyboard accessible.
- Fix tab markup so each tab has a matching `id` and `aria-labelledby`.
- Avoid using color as the only signal for priority.

Learning goal: semantic HTML, keyboard navigation, ARIA basics, and inclusive UI.

### 9. Add Dark Theme Properly (NOT PRIORITY)

- Use CSS custom properties for light and dark colors.
- Add a theme toggle button.
- Save selected theme in `localStorage`.
- Respect system preference with `prefers-color-scheme`.

Learning goal: design tokens, CSS variables, user preferences, and progressive enhancement.

## Phase 2: Frontend Code Quality (WIP for 2nd Version)

Focus: make the frontend easier to maintain as it grows.

### 10. Organize JavaScript Into Modules

Suggested structure:

```text
js/
  main.js
  tasks.js
  storage.js
  render.js
  filters.js
  dates.js
```

- `tasks.js`: create, update, delete, toggle task data.
- `storage.js`: save and load from `localStorage`.
- `render.js`: turn task data into DOM.
- `filters.js`: handle active filter state.
- `dates.js`: format and compare dates.

Learning goal: modular code, separation of concerns, and maintainability.

### 11. Add Better Validation

- Require task name.
- Limit task title length.
- Require deadline or allow optional deadline intentionally.
- Prevent deadlines in the past if that behavior makes sense.
- Show inline validation messages near the fields.

Learning goal: user-friendly validation and error states.

### 12. Add Sorting And Search

- Sort by deadline.
- Sort by priority.
- Sort by newest or oldest.
- Search tasks by title.
- Combine search with filters.

Learning goal: derived state, array methods, and UI controls.

### 13. Add Task Details

- Add optional description.
- Add tags or categories.
- Add notes.
- Add created date and completed date.

Learning goal: data modeling and designing scalable UI.

### 14. Add Frontend Tests

- Start with small pure function tests for task operations.
- Test storage helpers.
- Add browser tests later for create/edit/delete flows.

Possible tools:

- Vitest for unit tests.
- Playwright for end-to-end tests.

Learning goal: confidence, regression prevention, and testable code design.

## Phase 3: Tooling And Project Setup

Focus: move from simple static files toward a professional frontend workflow.

### 15. Add Git Discipline (DONE)

- Use small commits with clear messages.
- Create branches for features.
- Write pull-request style notes even if working alone.
- Keep a `journey/` log for what you learned.

Learning goal: version control habits used in real teams.

### 16. Add A Build Tool (DONE)

When the static app starts feeling hard to organize, try Vite.

- Move from raw files to a Vite project.
- Use npm scripts for development and build.
- Keep the UI behavior the same during migration.

Learning goal: modern frontend tooling, bundling, and local dev servers.

### 17. Add Linting And Formatting

- Add ESLint.
- Add Prettier.
- Add simple npm scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest"
  }
}
```

Learning goal: consistent code style and automated feedback.

## Phase 4: Backend API

Focus: move task data out of the browser and into a real server.

### 18. Design The API Contract

Start with these endpoints:

```text
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

Task response example:

```json
{
  "id": "task_123",
  "title": "Deploy todo app",
  "deadline": "2026-06-30",
  "priority": "High",
  "completed": false,
  "createdAt": "2026-06-18T10:00:00.000Z",
  "updatedAt": "2026-06-18T10:00:00.000Z"
}
```

Learning goal: REST API design, request methods, status codes, and JSON contracts.

### 19. Choose A Backend Stack

Good beginner-friendly options:

- Node.js with Express.
- Node.js with Fastify.
- Bun with Hono.
- Next.js API routes if you later choose React or Next.js.

Recommended learning path: start with Express because the concepts are direct and widely documented.

Learning goal: routing, middleware, controllers, and server-side validation.

### 20. Add A Database

Start simple, then improve:

- Beginner: SQLite.
- Production-friendly: PostgreSQL.
- ORM option: Prisma or Drizzle.

Suggested tables:

```text
users
  id
  email
  password_hash
  created_at
  updated_at

tasks
  id
  user_id
  title
  description
  deadline
  priority
  completed
  created_at
  updated_at
```

Learning goal: schema design, relationships, migrations, and persistence.

### 21. Connect Frontend To Backend

- Replace `localStorage` reads with `fetch("/api/tasks")`.
- Replace local create/edit/delete with API calls.
- Add loading states.
- Add error states.
- Keep localStorage as an optional offline fallback later.

Learning goal: async JavaScript, promises, network errors, and client-server contracts.

## Phase 5: Authentication And Authorization

Focus: make the app personal and private.

### 22. Add User Registration And Login

- Register with email and password.
- Hash passwords on the server with bcrypt or argon2.
- Never store plain-text passwords.
- Add login endpoint.
- Add logout behavior.

Learning goal: identity basics, password handling, and session flow.

### 23. Choose Session Strategy

Recommended for learning:

- Start with server-side sessions and secure cookies.
- Later learn JWTs and compare the tradeoffs.

Important cookie settings:

- `HttpOnly`
- `Secure`
- `SameSite=Lax` or `SameSite=Strict`

Learning goal: sessions, cookies, browser security, and authentication tradeoffs.

### 24. Add Authorization Rules

- A user can only read their own tasks.
- A user can only update their own tasks.
- A user can only delete their own tasks.
- Backend must enforce this, not only the frontend.

Learning goal: authorization, ownership checks, and secure backend design.

## Phase 6: Security Basics

Focus: learn the risks that real apps must handle.

### 25. Input And Output Safety

- Validate request bodies on the backend.
- Escape or safely render user-generated content on the frontend.
- Avoid inserting raw HTML from user input.
- Set length limits for fields.

Learning goal: XSS prevention, validation, and defensive programming.

### 26. API Protection

- Add rate limiting for login.
- Add CSRF protection if using cookie-based sessions.
- Add CORS rules intentionally.
- Add secure HTTP headers with Helmet if using Express.

Learning goal: common web attack surfaces and practical mitigations.

### 27. Secrets Management

- Store secrets in environment variables.
- Never commit `.env` files.
- Add `.env.example`.
- Use separate development and production secrets.

Learning goal: configuration hygiene and production readiness.

## Phase 7: Deployment

Focus: make the app accessible outside your machine.

### 28. Deploy Frontend First

Good static hosting options:

- Netlify.
- Vercel.
- Cloudflare Pages.
- GitHub Pages.

Learning goal: build output, static hosting, custom domains, and HTTPS.

### 29. Deploy Backend

Options:

- VPS with Docker and Nginx.
- Render, Fly.io, Railway, or similar app platforms.
- Cloud VM from AWS, Google Cloud, Azure, or DigitalOcean.

Learning goal: server processes, ports, environment variables, and production networking.

### 30. Use Docker

- Create a backend `Dockerfile`.
- Add `docker-compose.yml` for backend plus database.
- Use volumes for local database persistence.
- Learn how production differs from local compose.

Learning goal: reproducible environments and deployment packaging.

### 31. Add Nginx On VPS

- Reverse proxy frontend and backend.
- Enable HTTPS with Let's Encrypt.
- Add gzip or brotli compression.
- Configure basic request size limits.

Learning goal: reverse proxies, TLS, domains, and production traffic flow.

## Phase 8: Logging, Monitoring, And Maintenance

Focus: understand what happens after the app is live.

### 32. Add Backend Logging

- Log incoming requests.
- Log errors with stack traces in development.
- Hide sensitive values in production logs.
- Use structured logs later.

Learning goal: observability and debugging production issues.

### 33. Add Error Handling

- Create consistent API error responses.
- Add frontend error messages for failed requests.
- Add a backend global error handler.
- Return proper HTTP status codes.

Learning goal: failure design and user-facing resilience.

### 34. Add Health Checks

- Add `GET /health`.
- Return app version, uptime, and database connectivity.
- Use it for deployment checks.

Learning goal: operational readiness.

### 35. Add Monitoring

Beginner-friendly options:

- UptimeRobot for uptime checks.
- Better Stack for logs and uptime.
- Sentry for frontend and backend errors.
- Grafana later if you want deeper infrastructure learning.

Learning goal: uptime, alerting, error tracking, and incident awareness.

## Phase 9: Personal Productivity Features

Focus: make the app useful enough that you personally want to use it.

### 36. Dashboard Improvements

- Show total tasks.
- Show completed tasks.
- Show overdue tasks.
- Show tasks due today.
- Show high-priority tasks.

Learning goal: computed state and information design.

### 37. Better Task Workflow

- Add recurring tasks.
- Add subtasks.
- Add due time, not only due date.
- Add drag-and-drop ordering.
- Add archive instead of permanent delete.

Learning goal: product thinking and more complex state transitions.

### 38. Notifications

- Browser notifications for due tasks.
- Email reminders later.
- Daily summary email later.

Learning goal: permissions, background work, scheduled jobs, and notification UX.

### 39. Offline Support

- Add a service worker.
- Cache static assets.
- Allow viewing tasks offline.
- Sync changes when the app reconnects.

Learning goal: progressive web apps and offline-first design.

## Suggested Learning Order

1. Make task create/read/update/delete work in the browser.
2. Save tasks to `localStorage`.
3. Make the app responsive.
4. Add filtering, sorting, search, and dark theme.
5. Refactor JavaScript into modules.
6. Add tests.
7. Move to Vite.
8. Build a backend API.
9. Add a database.
10. Connect frontend to backend.
11. Add authentication.
12. Add authorization.
13. Deploy frontend.
14. Deploy backend and database.
15. Add logging, monitoring, and backups.

## Recommended Next Three Tasks

Start here to get the highest learning value from your current codebase:

1. Implement JavaScript task creation from the existing form.
2. Render tasks from a JavaScript array instead of hardcoded HTML.
3. Save and load tasks with `localStorage`.

These three tasks will teach you the core frontend loop: user input, application state, rendering, and persistence.

