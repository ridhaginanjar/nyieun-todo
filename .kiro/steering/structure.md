# Project Structure

```
/
├── index.html          # Single-page entry point; all markup lives here
├── css/
│   └── style.css       # Global styles, CSS custom properties for theming
├── js/
│   └── main.js         # All application logic (CRUD, search, localStorage)
├── assets/
│   ├── circle.svg      # Unchecked task icon
│   └── redo.svg        # Restore/redo icon
└── .kiro/
    └── steering/       # AI steering documents
```

## Conventions

- **Single HTML file** — all views (All, Active, Completed tabs) are rendered in `index.html` using tab panels.
- **No component framework** — UI is built with plain DOM manipulation in `js/main.js`.
- **CSS variables** — all colors and theming tokens are defined in `:root` in `style.css`. Use existing variables rather than hard-coded color values.
- **Inline SVG** — icons within the HTML are inlined SVG; standalone icons are in `assets/`.
- **BEM-lite class naming** — classes use lowercase with hyphens (e.g., `todo-item`, `task-info`, `btn-clean-border`). No strict BEM but keep the pattern consistent.
- **localStorage schema** — tasks are stored as a JSON array under the key `"todos"`. Each item: `{ id: number (Date.now), todo: string, isArchived: boolean }`.
- **No modules** — JavaScript is loaded as a classic script (no `type="module"`). Keep all logic in `js/main.js` unless the file grows significantly.
- **Accessibility** — use ARIA roles/attributes on interactive elements (tabs use `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`). Buttons have `aria-label` where icon-only.
