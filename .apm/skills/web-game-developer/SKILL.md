---
name: web-game-developer
description: "Use when building browser games in TypeScript/JavaScript with HTML5 Canvas or the DOM — grid/turn-based games (Tic-Tac-Toe, 2048, Minesweeper, Connect Four, Wordle) and real-time arcade games (Snake, Pong, Breakout, Tetris, Flappy). Invoke to scaffold a game fast, implement a game loop, handle keyboard/pointer input, model and render game state, detect collisions and win conditions, and add features incrementally under time pressure. Trigger keywords: web game, browser game, HTML5 canvas, requestAnimationFrame, game loop, TypeScript game, DOM game, grid game, sprite, collision detection, game state."
license: MIT
metadata:
  author: Agustin Renteria Beltran
  version: "1.0.0"
  domain: specialized
  triggers: web game, browser game, HTML5 canvas, requestAnimationFrame, game loop, TypeScript game, DOM game, grid game, collision detection, game state, Snake, Tetris, Tic-Tac-Toe, 2048, Minesweeper
  role: specialist
  scope: implementation
  output-format: code
---

# Web Game Developer

Ship small browser games fast in vanilla **TypeScript** — no framework — covering
both **DOM/grid** games (turn-based, board state) and **Canvas** games (real-time
render loop). Tuned for timed challenges where features are released one at a time
and you add them without rewrites, while narrating to an interviewer.

## Operating loop (built for speed)

1. **Read what exists** — If handed a repo, find the state model, the update step,
   and the render/output. Run it first; know the current behavior before changing it.
2. **Locate the seam** — Map the new feature to ONE of: state shape, update rule,
   input, or render. Touch the smallest surface that delivers it.
3. **Implement** — Keep the change additive. Don't refactor working code mid-clock.
4. **Verify by running** — Reload the dev server, drive the game (keyboard or
   Playwright), confirm the feature works AND nothing regressed. Say what you checked.
5. **Narrate** — One line on what changed and why. Keep the interviewer with you.

## Core architecture (keeps features cheap to add)

Separate three concerns so each new feature lands in one place:

- **State** — one plain, serializable object that fully describes the game. No DOM
  references inside it.
- **Update** — `update(state, input, dt) -> state`. Pure where practical: same
  inputs ⇒ same output. This is your testable core and where most rules live.
- **Render** — `render(state)` reads state and writes to DOM or Canvas. No game
  logic here. Re-render from state; never mutate the UI ad hoc.

Capture **input** into a small object/queue that update reads — never wire game
rules directly onto event handlers.

## Reference guide

| Topic | Reference | Load when |
|-------|-----------|-----------|
| Game loop, timing, input | `references/game-loop-and-input.md` | rAF loop, fixed timestep, delta time, keyboard/pointer, pause |
| DOM / grid / turn-based | `references/dom-grid-games.md` | Tic-Tac-Toe, 2048, Minesweeper, Connect Four, Wordle — board model, win detection |
| Canvas / arcade | `references/canvas-arcade-games.md` | Snake, Pong, Breakout, Tetris — rendering, entities, AABB collision, spawning |
| Architecture & feature flow | `references/architecture-and-feature-flow.md` | Adding features incrementally, scoring/levels/restart, quick tests, common asks |
| Interview playbook | `references/interview-playbook.md` | Timeboxing a live challenge, DOM-vs-Canvas decision, feature-drop map, English talk-track |

## Non-negotiables

**Always**
- Run the game and verify each feature in the browser before calling it done.
- Keep all game state in one object; derive the view from it.
- Make the update step deterministic where you can — it's what makes rules testable.
- Use `requestAnimationFrame` with delta time for motion (never `setInterval` for
  animation); decouple a fixed logic step from the render frame for stable speed.
- Guard win/lose/restart transitions explicitly; freeze input once the game is over.

**Never**
- Block the main thread (sync loops, `alert` inside the loop, huge synchronous work).
- Scatter game state across DOM attributes or module-level mutables.
- Rebuild the whole DOM every frame when a targeted update suffices (grid games),
  or thrash layout by interleaving style reads and writes.
- Refactor or rename broadly while the clock is running — make the additive change.

## Key patterns

### Fixed-timestep loop (real-time games)
```ts
let last = performance.now();
let acc = 0;
const STEP = 1000 / 60; // logic at 60 Hz, independent of refresh rate

function frame(now: number) {
  acc += now - last;
  last = now;
  while (acc >= STEP) {
    state = update(state, input.snapshot(), STEP / 1000);
    acc -= STEP;
  }
  render(state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

### Immutable board update (grid games)
```ts
type Cell = "X" | "O" | null;
type Board = Cell[]; // length 9

function place(board: Board, i: number, p: "X" | "O"): Board {
  if (board[i]) return board;          // illegal move: no-op
  const next = board.slice();
  next[i] = p;
  return next;
}

const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function winner(b: Board): Cell {
  for (const [a, c, d] of LINES)
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return null;
}
```

### AABB collision (arcade games)
```ts
type Box = { x: number; y: number; w: number; h: number };
const hit = (a: Box, b: Box) =>
  a.x < b.x + b.w && a.x + a.w > b.x &&
  a.y < b.y + b.h && a.y + a.h > b.y;
```

Spin up a project in seconds with the bundled `templates/vite-ts-game/` starter, and
follow `references/interview-playbook.md` for timeboxing and the verify-by-running flow.
