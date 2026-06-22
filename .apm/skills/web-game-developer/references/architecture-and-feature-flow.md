# Architecture & feature flow

How to structure a game so that *features released one at a time* each land in one
small place — the whole point of the interview format.

## The contract: State → Update → Render → Input

```ts
// state.ts — the single source of truth, serializable
export interface State { /* everything the game needs to be re-drawn */ }
export function initState(): State { /* fresh game */ }

// update.ts — the rules; pure where practical
export function update(s: State, input: Input, dt: number): State { /* return next */ }

// render.ts — read-only view of state (DOM or canvas)
export function render(s: State): void { /* draw, no logic */ }

// input.ts — events -> a snapshot update can read
export const input = { snapshot(): Input { /* ... */ } };
```

`main.ts` wires them: init → loop (real-time) or event→update→render (turn-based).
**When a new feature drops, ask: does it change the state shape, a rule, input, or
the view?** Then touch only that file.

## Where common feature drops land

| Feature released | Lands in | Shape of the change |
|---|---|---|
| Score | state (+`score`), update (increment on event), render (draw it) | additive field |
| Restart / "play again" | input (key/button), main (`state = initState()`) | reset, don't mutate |
| Pause | state (`status`), update (early-return when paused) | one guard |
| Win / lose / game over | update (set `status`), render (overlay), input (freeze) | terminal transition |
| Difficulty ramp / speed up | state (`tickInterval`/`speed`), update (shrink over time) | tune a number |
| Levels / waves | state (`level`), update (advance on clear), data table per level | data-driven |
| High score persistence | render/main via `localStorage` | side effect at boundary |
| Undo | keep a history stack of states (immutability makes this free) | push/pop |
| Two players / hotseat | state (`turn`), update (alternate), input (per-player) | already there if turn-based |
| AI opponent | a `chooseMove(state)` function update calls on the AI's turn | pure function |
| Timer / countdown | state (`timeLeft`), update (`-= dt`, lose at 0), render | one field + guard |
| Sound / particles | render only (effects read state; never drive logic) | view-layer |

The pattern: **most features are a new field on state + a rule in update + a line in
render.** If a feature is forcing a big rewrite, you probably put logic in the wrong
layer (e.g. rules inside event handlers or render).

## Determinism (makes rules testable and bugs reproducible)

Keep `update` a pure function of `(state, input, dt)`. For randomness (food spawn,
piece bag, mines), use a **seeded** RNG so a game can be replayed exactly.

```ts
// mulberry32 — tiny seeded PRNG
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// store the seed and the rng in state; never call Math.random() in update.
```

## Quick tests (when correctness matters more than pixels)

The pure update step is unit-testable without a browser. Even a 5-line assert harness
catches win-detection and merge bugs fast.

```ts
// either vitest (`npx vitest`) ...
import { describe, it, expect } from "vitest";
it("detects a row win", () => {
  expect(winner(["X","X","X",null,null,null,null,null,null])).toBe("X");
});

// ... or a dependency-free check you can run with `npx tsx test.ts`
function assert(cond: boolean, msg: string) { if (!cond) throw new Error(msg); }
assert(slideLeft([2,2,0,0]).row[0] === 4, "2+2 should merge to 4");
console.log("ok");
```
In a 25-minute slot, test the *logic* you're unsure of (merges, win lines, scoring),
and verify everything else by running the game.

## Verify by running

Don't claim a feature works until you've seen it. Start the dev server and either
drive it by hand or with Playwright (navigate → snapshot/screenshot → click/press →
re-snapshot). The bundled `run-and-verify` command automates this. Always confirm the
new feature *and* that the previous ones still work.

## Anti-patterns under time pressure
- Game state living in the DOM/closures instead of one object → desync, no undo, no tests.
- Rules inside `onclick`/`keydown` handlers → can't test, can't pause, duplicated logic.
- `setInterval` for animation → speed varies by machine, runs in background tabs.
- Mutating shared arrays while iterating them → skipped/double-processed entities.
- Big speculative refactor when a feature could be a 3-line additive change.
- Saying "done" without reloading the page.
