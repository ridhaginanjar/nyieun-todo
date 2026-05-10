# Tech Stack

## Languages & Runtime
- HTML5
- CSS3 (custom properties / CSS variables for theming)
- Vanilla JavaScript (ES6+, no framework)

## Fonts
- Google Fonts: Inter (weights 400–800)

## Storage
- Browser localStorage for task persistence

## Build System
- None. This is a static site with no build step, bundler, or package manager.
- Open `index.html` directly in a browser or serve with any static file server.

## Common Commands
```bash
# Serve locally (requires Python 3)
python3 -m http.server 8000

# Or with Node.js http-server (if installed globally)
npx http-server .
```

## Testing
- No test framework is currently configured.

## Dependencies
- Zero runtime dependencies. No node_modules or package.json.
