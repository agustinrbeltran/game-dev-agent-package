---
description: Architecture and performance guardrails for vanilla-TypeScript browser game source.
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# Web game source rules

Rules for browser game code. Keep games **smooth (60 FPS for real-time)** and, above
all, **correct and cheap to extend** feature-by-feature.

## Architecture (so each feature lands in one place)
- Keep all game state in ONE serializable object — never scatter it across DOM
  attributes, closures, or module-level mutables.
- Put rules in `update(state, input, dt)`, not in event handlers. Keep it pure where
  practical (same inputs ⇒ same output) so it's testable.
- `render(state)` only draws (DOM or Canvas). No game logic in render.
- Capture input into a snapshot/queue that update reads; don't run rules on `keydown`.

## Real-time loop (Canvas / arcade)
- Animate with `requestAnimationFrame` and delta time — never `setInterval`.
- Multiply all motion by `dt`; run logic on a fixed timestep for stable speed and
  collision. Clamp `dt` to survive tab stalls.
- One `clearRect` + redraw per frame; don't erase individual sprites.

## Turn-based / grid (DOM)
- Treat moves as state transitions: input → next board → re-render → check end state.
- Prefer immutable board updates (copy, apply, compare) — makes undo, AI lookahead,
  and "did anything change?" trivial.
- Re-render from state; never reach into the DOM to flip one cell by hand.
- Use event delegation (one listener on the board container) so it survives re-renders.

## Correctness & end states
- Detect win/lose/draw after every move or tick; set a `status`; freeze input until
  restart.
- For randomness, use a seeded RNG stored in state — never `Math.random()` inside
  update — so games are reproducible and testable.

## Before marking work done
- Run the game in the browser and verify the feature works AND prior features still do.
- Unit-test the logic you're unsure of (win lines, merges, scoring); verify the rest
  by running.
