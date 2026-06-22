// Wires the loop: input -> update -> render. For a turn-based game, drop the rAF
// loop and instead call update+render from a click/keydown handler.

import { initState, update, render, WIDTH, HEIGHT, type State } from "./game";
import { snapshot } from "./input";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const ctx = canvas.getContext("2d")!;

// Crisp on high-DPI screens, then draw in CSS pixels (WIDTH x HEIGHT).
const dpr = window.devicePixelRatio || 1;
canvas.width = WIDTH * dpr;
canvas.height = HEIGHT * dpr;
canvas.style.width = `${WIDTH}px`;
canvas.style.height = `${HEIGHT}px`;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

let state: State = initState();
let last = performance.now();

function frame(now: number): void {
  const dt = Math.min((now - last) / 1000, 0.1); // clamp big gaps (tab switch / stall)
  last = now;
  state = update(state, snapshot(), dt);
  render(ctx, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
