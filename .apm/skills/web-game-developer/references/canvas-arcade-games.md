# Canvas / arcade games

Snake, Pong, Breakout, Space Invaders, Flappy, Asteroids, Tetris. Real-time motion,
a render loop (see `game-loop-and-input.md`), and collision. Draw to a `<canvas>` 2D
context.

## Canvas setup (crisp on retina)

Scale the backing store by devicePixelRatio so it isn't blurry, then work in CSS
pixels.

```ts
const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const ctx = canvas.getContext("2d")!;
function fit(cssW: number, cssH: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // now 1 unit = 1 CSS px
}
fit(480, 480);
```

## Render: clear, then draw from state

```ts
function render(s: State) {
  ctx.clearRect(0, 0, 480, 480);            // or fillRect a background
  ctx.fillStyle = "#22d3ee";
  for (const e of s.entities) ctx.fillRect(e.x, e.y, e.w, e.h);
}
```
Drawing is just paint — never put game rules in `render`. If you need text:
`ctx.font = "20px system-ui"; ctx.fillText(\`Score ${s.score}\`, 12, 28);`

## Entities & movement

Keep entities as plain objects in a state array; integrate position with dt.

```ts
interface Entity { x: number; y: number; vx: number; vy: number; w: number; h: number; }
function integrate(e: Entity, dt: number) { e.x += e.vx * dt; e.y += e.vy * dt; }
```

### Walls: clamp (Pong paddle) or wrap (Asteroids) or bounce (ball)
```ts
// bounce
if (ball.x < 0 || ball.x + ball.w > W) ball.vx *= -1;
// wrap
if (e.x > W) e.x = 0; else if (e.x < 0) e.x = W;
// clamp
paddle.y = Math.max(0, Math.min(H - paddle.h, paddle.y));
```

## Collision

### AABB (rectangles — paddles, bricks, platforms)
```ts
const hit = (a: Entity, b: Entity) =>
  a.x < b.x + b.w && a.x + a.w > b.x &&
  a.y < b.y + b.h && a.y + a.h > b.y;
```

### Circle (balls, radial blasts)
```ts
const circleHit = (ax:number,ay:number,ar:number, bx:number,by:number,br:number) =>
  (ax-bx)**2 + (ay-by)**2 <= (ar+br)**2;
```

### Breakout brick bounce: flip the axis of least penetration
After detecting a hit, compare horizontal vs. vertical overlap to decide which
velocity component to invert — avoids the ball tunneling through.

## Grid-on-canvas games (Snake, Tetris)

Logic lives on a cell grid; rendering multiplies by a cell size. Movement is per
tick, not per frame (see the grid-stepped loop).

```ts
const CELL = 20;
function step(s: SnakeState) {
  const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
  // wall or self collision => game over
  if (head.x < 0 || head.x >= s.cols || head.y < 0 || head.y >= s.rows ||
      s.snake.some((p) => p.x === head.x && p.y === head.y)) { s.status = "lost"; return; }
  s.snake.unshift(head);
  if (head.x === s.food.x && head.y === s.food.y) { s.score++; s.food = spawnFood(s); }
  else s.snake.pop(); // didn't eat: move tail forward
}
// draw: ctx.fillRect(cell.x * CELL, cell.y * CELL, CELL - 1, CELL - 1)
```
Snake gotcha: ignore a direction reversal onto yourself (can't go left while moving
right). Buffer one turn per tick so fast key taps don't let you U-turn.

## Spawning without leaks

There's no GC pressure problem at interview scale — but keep spawns/despawns in the
update step and off arrays you also iterate. To remove, filter:
`s.bullets = s.bullets.filter((b) => b.y > 0 && !b.dead);`

## Sound (optional, zero assets)

A quick beep via WebAudio — no files to load.
```ts
function beep(freq = 440, ms = 80) {
  const ac = new AudioContext();
  const osc = ac.createOscillator(); const gain = ac.createGain();
  osc.frequency.value = freq; osc.connect(gain); gain.connect(ac.destination);
  gain.gain.setValueAtTime(0.1, ac.currentTime);
  osc.start(); osc.stop(ac.currentTime + ms / 1000);
}
```
(Browsers require a user gesture before audio; create the context on first input.)

## Principles
- One `clearRect` + redraw per frame — don't try to erase individual sprites.
- All motion scales by `dt`; all logic ticks at a fixed rate for stable speed.
- Detect collisions in `update` and set state flags; let `render` only draw.
- Keep the grid logic (cells) separate from pixels (cell × size) — it makes win/lose
  and collision integer-exact and bug-free.
