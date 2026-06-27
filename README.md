# NyieunTudu

NyieunTudu is a browser-based todo app built as a frontend learning project. The goal is not only to create a working task manager, but also to practice the core frontend loop: user input, application state, rendering, persistence, and gradual code quality improvements.

This project is currently a static frontend app using HTML, CSS, and JavaScript modules.

## Current Features

- Create a task with title, deadline, and priority.
- Validate empty task titles before creating a task.
- Mark tasks as completed or pending.
- Delete tasks.
- Filter tasks by:
  - Your Missions (`pending`)
  - Completed Missions (`completed`)
- Persist task data with `localStorage`.
- Render task UI dynamically from JavaScript data.
- Show empty state when a filtered tab has no tasks.
- Animate completed tasks with a custom line-through effect.

## Tech Stack

- HTML
- CSS
- JavaScript
- JavaScript modules
- Browser `localStorage`

No build tool is required yet. The next learning phase is moving toward a more professional frontend workflow with tools like Vite, npm scripts, ESLint, and Prettier.

## Project Structure

```txt
.
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── utils.js
├── assets/
│   ├── circle.svg
│   └── redo.svg
├── journey/
│   ├── improvement-roadmap.md
│   └── learning.md
└── testing/
    └── index.html
```

## How To Run

Because this project uses JavaScript modules, open it through a local server instead of opening `index.html` directly from the file system.

One simple option:

```bash
python3 -m http.server 8000
```

Then open:

```txt
http://localhost:8000
```

If you use VS Code, the Live Server extension also works.

## Learning Goals

This repository is used to practice:

- DOM selection and event handling.
- Form submission with `event.preventDefault()`.
- Task data modeling with JavaScript objects.
- Rendering UI from arrays.
- Event delegation for dynamically rendered todo items.
- `localStorage` persistence with JSON serialization.
- Filtering UI by active tab state.
- Separating data updates from rendering.
- Using `async/await` with a Promise-based delay.
- CSS pseudo-elements and pseudo-classes.
- Incremental refactoring toward cleaner frontend code.

## Current Data Model

Each task follows this general shape:

```js
{
    id: "unique-id",
    title: "Learn DOM",
    deadline: "2026-06-30",
    priority: "High",
    completed: false,
    createdAt: "2026-06-27T10:00:00.000Z",
    updatedAt: "2026-06-27T10:00:00.000Z"
}
```

## Current Focus

The project is moving from Phase 2 to Phase 3 in the learning roadmap.

Current engineering focus:

- Refactor `main.js` into smaller, clearer functions.
- Keep one consistent render flow:

```txt
update data -> saveTask() -> renderCurrentView()
```

- Reduce stale data bugs by reading the latest task data before rendering.
- Prepare the project for a frontend tooling workflow.

## Next Steps

Planned improvements:

- Move to a Vite project structure.
- Add npm scripts for development and build.
- Add ESLint for automated JavaScript feedback.
- Add Prettier for consistent formatting.
- Improve responsive layout.
- Improve accessibility for tabs and custom controls.
- Reduce XSS risk from rendering user input with HTML strings.

## Known Limitations

- The app is currently desktop-focused.
- Task rendering still uses HTML template strings.
- User input should be escaped or rendered with `textContent` to reduce XSS risk.
- Edit task is not fully implemented yet.
- There is no automated test setup yet.

## Learning Journal

Learning notes are documented in:

- `journey/learning.md`
- `journey/improvement-roadmap.md`

These files track not only what changed, but also the reasoning behind the changes.
