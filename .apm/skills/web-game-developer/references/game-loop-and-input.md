# Game loop & input

For real-time games (Snake, Pong, Breakout, Tetris, anything that moves on its own).
Turn-based grid games don't need a loop — they re-render on each move (see
`dom-grid-games.md`).

## The loop: requestAnimationFrame, never setInterval

`requestAnimationFrame` (rAF) is synced to the display, pauses on hidden tabs, and
gives you a high-resolution timestamp. `setInterval` drifts, keeps running in the
background, and ties game speed to a guessed framerate. Always use rAF for animation.

### Variable timestep (simplest — fine for most challenges)
Multiply every motion by `dt` (seconds since last frame) so speed is the same on a
60 Hz and a 144 Hz display.

```ts
let last = performance.now();
function frame(now: number) {
  const dt = Math.min((now - last) / 1000, 0.1); // clamp: avoid huge jumps after a stall
  last = now;
  state = update(state, input.snapshot(), dt);
  render(state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

### Fixed timestep (preferred when physics/collision must be stable)
Accumulate real time and step the logic at a constant rate. Decouples simulation
from render framerate, so collisions and speeds are deterministic and reproducible.

```ts
const STEP = 1000 / 60; // 60 logic ticks/sec
let last = performance.now();
let acc = 0;
function frame(now: number) {
  acc += now - last;
  last = now;
  let guard = 0;
  while (acc >= STEP && guard++ < 5) {   // guard prevents spiral-of-death after a stall
    state = update(state, input.snapshot(), STEP / 1000);
    acc -= STEP;
  }
  render(state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

### Grid-stepped games (Snake, Tetris gravity)
Movement happens on a tick, not every frame. Accumulate dt and step when it crosses
an interval — shrink the interval to speed the game up (difficulty ramp).

```ts
state.timer += dt;
if (state.timer >= state.tickInterval) {
  state.timer -= state.tickInterval;
  step(state); // advance the snake one cell / drop the piece one row
}
```

## Pause / resume / game over

Gate the simulation, not the loop. Keep rendering so the screen stays live.

```ts
function update(s: State, input: Input, dt: number): State {
  if (s.status !== "playing") return s; // paused / won / lost: ignore input + time
  // ...advance simulation...
}
```

When resuming after a pause or tab switch, reset `last = performance.now()` so the
clamp doesn't swallow a giant dt.

## Input

Capture events into state you can read inside `update`. Two shapes cover almost
everything:

### Held keys (movement) — a Set of currently-pressed keys
```ts
const pressed = new Set<string>();
addEventListener("keydown", (e) => {
  pressed.add(e.key);
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))
    e.preventDefault(); // stop the page from scrolling
});
addEventListener("keyup", (e) => pressed.delete(e.key));

export const input = {
  snapshot: () => ({
    up: pressed.has("ArrowUp") || pressed.has("w"),
    down: pressed.has("ArrowDown") || pressed.has("s"),
    left: pressed.has("ArrowLeft") || pressed.has("a"),
    right: pressed.has("ArrowRight") || pressed.has("d"),
    fire: pressed.has(" "),
  }),
};
```

### Discrete presses (turn, drop, confirm) — a queue drained each tick
A held-key Set fires every frame; for "rotate once per press" buffer key *events*
and consume them in update so one press = one action.

```ts
const queue: string[] = [];
addEventListener("keydown", (e) => { if (!e.repeat) queue.push(e.key); });
export const takeKeys = () => queue.splice(0); // drain; update applies each once
```

### Pointer / touch on a canvas
Convert client coords to canvas coords; account for canvas CSS size vs. backing size.

```ts
function canvasPos(canvas: HTMLCanvasElement, e: PointerEvent) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (canvas.width / r.width),
    y: (e.clientY - r.top) * (canvas.height / r.height),
  };
}
canvas.addEventListener("pointerdown", (e) => { /* push to input queue */ });
```

## Gotchas
- Call `e.preventDefault()` on arrow keys/space, or the page scrolls under the game.
- A backgrounded tab throttles rAF; the dt clamp keeps the first frame back sane.
- For deterministic replays/tests, drive `update` from a recorded input list instead
  of live events — same inputs + seeded RNG ⇒ same game.
