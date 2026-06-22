---
description: Add one game feature to an existing browser game, additively, and verify it by running.
input:
  - feature: "The feature to add (e.g. score, restart, win detection, difficulty ramp, AI opponent)"
  - notes: "Optional constraints or details (e.g. 'speed up every 10 points', 'X always goes first')"
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Implement feature: ${input:feature}

Add **${input:feature}** to the current browser game. ${input:notes}

Work as the Web Game Developer role and keep the change small and additive:

1. **Orient** — Find the state model, the update step, the render, and input. Run the
   game first if it isn't already running; confirm current behavior.
2. **Locate the seam** — Decide which ONE concern this feature touches: state shape,
   an update rule, input, or render. Map most features to "new field on state + rule
   in update + line in render."
3. **Implement** — Make the additive change in that layer. Don't refactor or rename
   working code. Guard any new end-state/transition explicitly.
4. **Verify by running** — Reload the dev server and drive the game (keyboard or
   Playwright). Confirm the new feature works AND the previous behavior still does.
5. **Report** — State what changed (file + layer), what you ran to verify, and what
   you observed — in 2–3 lines.

If the feature seems to need a rewrite, stop: the logic is probably in the wrong
layer. Move it to state/update/render and the feature becomes additive.
