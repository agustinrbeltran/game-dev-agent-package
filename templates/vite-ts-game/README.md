# vite-ts-game — starter

A minimal, runnable vanilla-TypeScript browser game. No framework. Built so every
feature lands in one of four files.

## Run

```bash
npm install   # do this once BEFORE the interview to warm the cache
npm run dev    # http://localhost:5173
```

`npm run typecheck` to typecheck, `npm run build` to produce a static bundle.

## Structure

| File | Role |
|------|------|
| `src/game.ts` | **State + `update()` + `render()`** — the whole game. Edit this most. |
| `src/input.ts` | Events → an `Input` snapshot the logic reads. |
| `src/main.ts` | Wires the loop (input → update → render) and sizes the canvas. |
| `index.html` | The canvas (or swap in `<div id="board">` for a grid game). |
| `src/style.css` | Layout + HUD. |

The demo (move a square with arrows/WASD, collect dots, `R` to restart) exists only
to prove the loop runs. Delete its contents and keep the **State / update / render**
shape.

## Adding a feature

Ask which layer it touches, then change only that:
- **new data** (score, lives, level) → a field on `State`
- **a rule** (collision, win, scoring) → `update()`
- **how it looks** → `render()`
- **a new control** → `input.ts`

Most features = one field on State + one rule in update + one line in render.

## Turn-based / grid game instead?

Drop the rAF loop in `main.ts`. Render a board to `<div id="board">` with CSS Grid,
use event delegation for clicks, and call `update`+`render` per move. See the
`dom-grid-games.md` reference in the `web-game-developer` skill.

## No-network fallback

If `npm install` won't run, delete `package.json`/`tsconfig.json`, rename the `.ts`
files to `.js` (strip the types), point `index.html`'s script at `/src/main.js`, and
serve with `python3 -m http.server`. Zero build, instant reload.
