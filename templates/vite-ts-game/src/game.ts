// The whole game lives here as State + update + render.
// This is a tiny demo (move a square, collect dots, score). Delete the demo bits
// and keep the State/update/render shape — every feature slots into one of them.

import type { Input } from "./input";

export const WIDTH = 480;
export const HEIGHT = 480;

export interface State {
  player: { x: number; y: number; size: number; speed: number };
  target: { x: number; y: number; r: number };
  score: number;
  status: "playing" | "over";
}

// Replace with a seeded RNG (see the skill) if you need reproducible runs/tests.
function randomTarget(): State["target"] {
  const r = 10;
  return {
    x: r + Math.random() * (WIDTH - 2 * r),
    y: r + Math.random() * (HEIGHT - 2 * r),
    r,
  };
}

export function initState(): State {
  return {
    player: { x: WIDTH / 2 - 12, y: HEIGHT / 2 - 12, size: 24, speed: 220 },
    target: randomTarget(),
    score: 0,
    status: "playing",
  };
}

// Pure-ish rules: same (state, input, dt) -> same next state. No drawing here.
export function update(s: State, input: Input, dt: number): State {
  if (input.presses.includes("r") || input.presses.includes("R")) return initState();
  if (s.status !== "playing") return s;

  const p = s.player;
  const d = p.speed * dt; // scale movement by delta time -> same speed on any display
  if (input.left) p.x -= d;
  if (input.right) p.x += d;
  if (input.up) p.y -= d;
  if (input.down) p.y += d;

  // clamp to the walls
  p.x = Math.max(0, Math.min(WIDTH - p.size, p.x));
  p.y = Math.max(0, Math.min(HEIGHT - p.size, p.y));

  // collect the target: circle vs. the player's center
  const cx = p.x + p.size / 2;
  const cy = p.y + p.size / 2;
  const t = s.target;
  if ((cx - t.x) ** 2 + (cy - t.y) ** 2 <= (t.r + p.size / 2) ** 2) {
    s.score += 1;
    s.target = randomTarget();
  }
  return s;
}

const scoreEl = document.querySelector<HTMLSpanElement>("#score")!;

// Draw only — read state, paint pixels and the HUD. Never put rules here.
export function render(ctx: CanvasRenderingContext2D, s: State): void {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#f472b6"; // target
  ctx.beginPath();
  ctx.arc(s.target.x, s.target.y, s.target.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#22d3ee"; // player
  ctx.fillRect(s.player.x, s.player.y, s.player.size, s.player.size);

  scoreEl.textContent = `Score: ${s.score}`;
}
